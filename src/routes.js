import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Map from "./components/Main";

export default () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Map}/>
        </Switch>
    </BrowserRouter>
);