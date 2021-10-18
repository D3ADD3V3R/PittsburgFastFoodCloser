import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NavbarComp from "./pages/tiles/navbar";

import history from "./helper/browserHistory";
import {Route, Router} from "react-router-dom";
import MainBody from "./pages/mainBody";


ReactDOM.render(
    <React.StrictMode>
            <header>
                <NavbarComp/>
            </header>
            <Router history={history}>
                <Route exact path="/" component={MainBody}/>
            </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

