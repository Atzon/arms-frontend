import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Map from "./components/Main";
import Main2 from "./components/Main2";
import Main4 from "./components/Main4";
import newMap from "./components/newMap";


export default () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Map}/>
            <Route exact path="/test2" component={Main2}/>
            <Route exact path="/test4" component={Main4}/>
            <Route exact path="/test" component={newMap}/>


        </Switch>
    </BrowserRouter>
);