import * as React from "react";


class NavbarComp extends React.Component {

    render() {

        return (

            <nav
                className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <img src="/ressources/logo.svg" alt="" width="30" height="24"
                             className="d-inline-block align-text-top"/>
                        Pittsburgh FastFood Closer
                    </a>
                </div>
            </nav>
        )
    }
}

export default NavbarComp