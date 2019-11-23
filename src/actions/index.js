import axios from 'axios';
import POINTS_1 from './5lines2.json';
import POINTS_5 from './5lines2.json';
import {AIRLY, MANGO} from "../utils/utils";

const ROOT_URL = 'https://arms-backend-server.herokuapp.com/api';
//const ROOT_URL = 'http://localhost:3000/api';


export const FETCH_POINTS = 'FETCH_POINTS';
export const FETCH_MANGO = 'FETCH_MANGO';
export const FETCH_AIRLY = 'FETCH_AIRLY';
export const ENABLE_AIRLY = 'ENABLE_AIRLY';
export const DISABLE_AIRLY = 'DISABLE_AIRLY';
export const ENABLE_MANGO = 'ENABLE_MANGO';
export const DISABLE_MANGO = 'DISABLE_MANGO';
export const TOGGLE_MANGO = 'TOGGLE_MANGO';
export const TOGGLE_AIRLY = 'TOGGLE_AIRLY';
export const THEME_CHANGE = 'THEME_CHANGE';

export function fetchPoints(){

    return (dispatch, getState) => {
        const { mango, airly } = getState();

        const mangoRes = mango.enabled ? mango.data : [];
        const airlyRes = airly.enabled ? airly.data : [];

        console.log("FETCH ALL POINTS ", mango, airly);


        dispatch({
            type: FETCH_POINTS,
            payload: [...mangoRes, ...airlyRes]
        });
    };

}

export function fetchPoints2(){

    const request = axios.get(`${ROOT_URL}/points`);

    return(dispatch) => {
        request.then(({data}) =>{
            dispatch({type: "FETCH_POINTS2", payload: data});
        });
    };
}


export function fetchAirly() {
    return (dispatch, getState) => {
        const request = axios.get(`${ROOT_URL}/points`);

        request.then(({data}) =>{
            dispatch({type: FETCH_AIRLY, loaded: false, payload: data});
            dispatch(fetchPoints());
        });

    };
}

export function fetchMango() {
    return (dispatch) => {
        dispatch({type: FETCH_MANGO, loaded: false, payload: POINTS_5});
        dispatch(fetchPoints());
    };
}

export function toggleAirly(){

    return (dispatch, getState) => {
        const { airly } = getState();

        if(!airly.loaded)
            dispatch(fetchAirly()) ;

        dispatch({type: TOGGLE_AIRLY});
        dispatch(fetchPoints());
    };
}

export function enableAirly(){

    return (dispatch, getState) => {
        const { airly } = getState();

        if(!airly.loaded)
            dispatch(fetchAirly()) ;

        dispatch({type: ENABLE_AIRLY});
        dispatch(fetchPoints());
    };
}

export function disableAirly(){
    return (dispatch) => {
        dispatch({type: DISABLE_AIRLY});
        dispatch(fetchPoints());
    };
}

export function enableMango(){

    return (dispatch, getState) => {
        const { airly } = getState();

        if(!airly.loaded)
            dispatch(fetchMango()) ;

        dispatch({type: ENABLE_MANGO});
        dispatch(fetchPoints());
    };
}

export function disableMango(){
    return (dispatch) => {
        dispatch({type: DISABLE_MANGO});
        dispatch(fetchPoints());
    };
}

export function toggleMango(){

    return (dispatch, getState) => {
        const { mango } = getState();

        if(!mango.loaded)
            dispatch(fetchMango());

        dispatch({type: TOGGLE_MANGO});
        dispatch(fetchPoints());
    };
}

export function themeChange(theme){
    return{
        type: THEME_CHANGE, theme: theme
    }
}

export function sourceChange(sources){

    return (dispatch) => {

        if(sources.includes(MANGO))
            dispatch(enableMango());
        else
            dispatch(disableMango());

        if(sources.includes(AIRLY))
            dispatch(enableAirly());
        else
            dispatch(disableAirly());
    };
}

export function initialise(sources){
    return (dispatch, getState) => {
        if(sources)
            return dispatch(sourceChange(sources));
        const {settings} = getState();
        return dispatch(sourceChange(settings.sources));
    }
}