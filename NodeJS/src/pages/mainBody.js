import * as React from "react";
import Alert from "react-bootstrap/Alert";
import * as turf from "@turf/helpers";
import distance from "@turf/distance";
import Papa from "papaparse";

export default class MainBody extends React.Component {

    data = {
        closed_restaurants : [

        ],
        open_restaurants : [],
        open_schools : [

        ],
        closed_schools : []
    }

    info = {
        infoTitle: "",
        infoText: "",
        infoColor: "success"
    }

    constructor(props) {
        super(props);
        this.state = {
            infoShow: false
        }
    }

    insertRestaurantData(self, results){
        console.log("Restaurant Parsing complete");
        self.data.open_restaurants = results.data;
        self.data.open_restaurants.pop();
        self.data.open_restaurants.forEach((restaurant, index) =>{
            restaurant["id"] = index;
            let result = false;

            self.data.open_schools.forEach((school) => {
                const from = turf.point([parseFloat(restaurant["latitude"]), parseFloat(restaurant["longitude"])]);
                const to = turf.point([parseFloat(school["latitude"]), parseFloat(school["longitude"])]);
                const dist = distance(from, to).toFixed(2);

                if(dist <= 0.5)
                {
                    console.log("gefinden");
                    result = true;
                    restaurant["dist"] = dist;
                }

            })

            if(result){
                self.data.closed_restaurants.push(restaurant);
                //self.data.open_restaurants.splice(index);
            }

        })

        this.refreshRestaurant();
        this.refreshCount();
    }

    refreshRestaurant() {
        const closeRestaurantTable = document.getElementById("closedRestaurants");
        const len = closeRestaurantTable.rows.length
        for(let i = 1; i < len; i++)
            closeRestaurantTable.deleteRow(1);

        this.data.closed_restaurants.forEach((restaurant, index) => {
            const row = closeRestaurantTable.insertRow(closeRestaurantTable.rows.length);
            this.formatRestaurant(index, row, restaurant, true);
        });
    }

    formatRestaurant(index, row, restaurant) {
        row.id = "restaurant-" + index;
        row.insertCell(0).innerText = restaurant.venue_name;
        row.insertCell(1).innerText = restaurant.venue_address;
        row.insertCell(2).innerText = restaurant.dist;
    }

    insertSchoolData(self, results){
        console.log("School Parsing complete");
        self.data.open_schools = results.data;
        self.data.open_schools.pop();
        for(var i = 0;i < self.data.open_schools.length; i++){
            self.data.open_schools[i]["id"] = i;
        }

        self.fillSchoolTables();

        const Papa = require('papaparse');
        const csvFilePath= "https://data.wprdc.org/dataset/682daad1-6d3a-45d3-8710-6c961146e19b/resource/5b58c467-8e6a-4abc-9dd5-a39881770b3c/download/2019_pittsburgh_fish_fry_locations.csv";
        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            complete: (results, file) => this.insertRestaurantData(self, results)
        })

    }

    fillSchoolTables(){
        const openSchoolTable = document.getElementById("openSchools");
        openSchoolTable.deleteRow(1);
        this.data.open_schools.forEach((school, index) => {
            const row = openSchoolTable.insertRow(openSchoolTable.rows.length);
            this.formatSchool(index, row, school, true);
        });
    }

    formatSchool(index, row, school, buttonMinus) {
        const self = this;
        row.id = (buttonMinus ? "open-" : "close-") + index;
        row.insertCell(0).innerText = school.id + 1;
        row.insertCell(1).innerText = school.name;
        row.insertCell(2).innerText = school.address;

        const button = document.createElement("button");
        button.id = (buttonMinus ? "close-" : "open-") + "btn-" + index;
        button.type = "button";
        button.addEventListener("click", function() {console.log("Wurdegedrückt")});
        button.style.width = "26px";
        button.style.height = "26px";
        button.style.padding = "0";

        if(buttonMinus) {
            button.className = "btn btn-outline-danger";
            button.innerHTML = "<i className=\"bi-patch-minus\"/>"

        }else {
            button.className = "btn btn-outline-success";
            button.innerHTML = "<i className=\"bi-patch-plus\"/>"
        }

        row.insertCell(3).innerHTML = button.outerHTML;
    }

    fetchData() {
        const Papa = require('papaparse');
        //const csvFilePath= process.env.PUBLIC_URL + '/ressources/2019_pittsburgh_fish_fry_locations.csv';
        const csvFilePath= "https://data.wprdc.org/dataset/46fb3ca4-e844-4b42-b034-e87291d34699/resource/06664b02-c673-49d5-8a70-d3cd1c18ac8d/download/pps_schoolsapr2019publish.csv";
        const self = this;

        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            complete: (results, file) => {this.insertSchoolData(self, results);}
        })

    }

    componentDidMount() {
        this.fetchData()
    }

    closeSchool(id) {
        const openSchoolTable = document.getElementById("openSchools")
        const closedSchoolTable = document.getElementById("closeSchools")

        openSchoolTable.deleteRow(id);

        const school =  this.getEntry(this.data.open_schools, id);
        this.data.open_schools.remove(school);
        this.data.closed_schools.append(school);

        const row = closedSchoolTable.insertRow(closedSchoolTable.rows.length);
        this.formatSchool(row, school, false);

        this.refreshRestaurant();
    }


    openSchool(id) {
        const openSchoolTable = document.getElementById("openSchools")
        const closedSchoolTable = document.getElementById("closeSchools")
        closedSchoolTable.deleteRow(id);

        const school =  this.getEntry(this.data.closed_schools, id);
        this.data.closed_schools.remove(school);
        this.data.open_schools.append(school);

        const row = openSchoolTable.insertRow(openSchoolTable.rows.length);
        this.formatSchool(row, school, false);

        this.refreshRestaurant();
    }

    getEntry(data, id){
        data.forEach((entry, index) => {
            if(entry["id"] === id){
                return entry;
            }
        })
    }

    refreshCount() {
        document.getElementById("closedRestNum").innerText = this.data.closed_restaurants.length;
        document.getElementById("openRestNum").innerText = this.data.open_restaurants.length;
        document.getElementById("closedSchoolNum").innerText = this.data.closed_schools.length;
        document.getElementById("openSchoolNum").innerText = this.data.open_schools.length;
    }

    render() {
        // Now Return Plain HTML
        const navStyle = {
            color: "black"
        }

        const secNavStyle = {
            fontWeight: "bold"
        }

        const buttonStyle = {
            width: 26,
            height: 26,
            padding: 0
        };

        return (
            <div>
                <nav className="nav nav-justified">
                    <li className="nav-item">
                        <p className="nav-link" style={navStyle}>Zu schliessende Restaurants: <span id="closedRestNum" style={secNavStyle}>{this.data.closed_restaurants.length}</span></p>
                    </li>
                    <li className="nav-item">
                        <p className="nav-link" style={navStyle}>Offene Restaurants: <span id="openRestNum" style={secNavStyle}>{this.data.open_restaurants.length}</span></p>
                    </li>
                    <li className="nav-item">
                        <p className="nav-link" style={navStyle}>Zu schliessende Schulen: <span id="closedSchoolNum" style={secNavStyle}>{this.data.closed_schools.length}</span></p>
                    </li>
                    <li className="nav-item">
                        <p className="nav-link" style={navStyle}>Offene Schulen: <span id="openSchoolNum" style={secNavStyle}>{this.data.open_schools.length}</span></p>
                    </li>
                </nav>
                <Alert dismissible={true} show={this.state.infoShow} variant={this.info.infoColor} onClose={() => {
                    this.setState({infoShow: false})
                }}>
                    {this.info.infoTitle !== "" ? <Alert.Heading>{this.info.infoTitle}</Alert.Heading> : null}
                    {this.info.infoText}
                </Alert>
                <div>
                    <div className="container" style={{marginTop: 20}}>
                    <h4 className="fs-4">All Restaurants to be closed</h4>
                        <div style={{maxHeight: 400, overflow: "auto"}}>
                    <table id="closedRestaurants" className="table table-striped table-hover">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Distance to next School</th>
                        </tr>
                        </thead>
                        <tbody  className="placeholder-glow">
                        {this.data.closed_restaurants.length === 0 ? <tr>
                            <td className="placeholder-glow" colSpan="5"><span>Daten werden geladen</span></td>
                        </tr> : null}
                        {this.data.closed_restaurants.length !== 0 ? this.data.closed_restaurants.map((reservation) => this.formatRestaurant(reservation)) : null}
                        </tbody>
                    </table>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col" style={{marginTop: 40}}>
                                <h4 className="fs-4">All Open Schools</h4>
                                <div style={{maxHeight: 400, overflow: "auto"}}>
                                <table id="openSchools" className="table table-striped table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Addresse</th>
                                        <th scope="col">city</th>
                                        <th scope="col"/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.data.open_schools.length === 0 ? <tr>
                                        <td className="placeholder-glow" colSpan="4"><span>Daten werden geladen</span></td>
                                    </tr> : null}
                                    {this.data.open_schools.length !== 0 ? this.data.open_schools.map((reservation) => this.formatSchool(reservation, true)) : null}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            <div className="col" style={{marginTop: 40}}>
                                <h4 className="fs-4">All Closed Schools</h4>
                                <div style={{maxHeight: 400, overflow: "auto"}}>
                                <table name="closedSchools" className="table table-striped table-hover">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Addresse</th>
                                        <th scope="col">City</th>
                                        <th scope="col"/>
                                    </tr>
                                    </thead>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



}