import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import reducers from './reducers';
import Routes from "./routes";
import thunk from 'redux-thunk';
//import * as serviceWorker from './serviceWorker';


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);


ReactDOM.render(
    <Provider store = {createStoreWithMiddleware(reducers)}>
        <Routes/>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();