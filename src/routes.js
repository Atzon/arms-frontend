import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Map from "./components/Main";
import Map2 from "./components/Main2";

export default () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Map}/>
            <Route exact path="/test" component={Map2}/>
            <Route exact path="/test/:source" component={Map2}/>
        </Switch>
    </BrowserRouter>
);
