import axios from 'axios';
import POINTS_1 from './5lines2.json';
import POINTS_5 from './5lines2.json';

const ROOT_URL = 'https://arms-backend-server.herokuapp.com/api';
//const ROOT_URL = 'http://localhost:3000/api';


export const FETCH_POINTS = 'FETCH_POINTS';
export const FETCH_MANGO = 'FETCH_MANGO';
export const FETCH_AIRLY = 'FETCH_AIRLY';
export const GET_AIRLY = 'GET_AIRLY';
export const GET_MANGO = 'GET_MANGO';
export const TOGGLE_MANGO = 'TOGGLE_MANGO';
export const TOGGLE_AIRLY = 'TOGGLE_AIRLY';

export function fetchPoints(){

    return (dispatch, getState) => {
        const { mango, airly, enabled } = getState();

        const mangoRes = enabled.mango ? mango : [];
        const airlyRes = enabled.airly ? airly: [];


        dispatch({
            type: FETCH_POINTS,
            payload: [...mangoRes, ...airlyRes]
        });
    };

}

export function fetchAirly() {


    return (dispatch, getState) => {
        const { loaded } = getState();

        if(loaded){
            dispatch({
                type: FETCH_AIRLY,
                loaded: true
            });
        }
        else{
            const request = axios.get(`${ROOT_URL}/points`);

            request.then(({data}) =>{
                dispatch({type: FETCH_AIRLY, loaded: false, payload: data});
            });
        }
    };
}

export function fetchMango() {
    console.log("fetching mango...");
    return {
        type: FETCH_MANGO, payload: POINTS_5
    };
}

export function getAirly(){
    return {
        type: GET_AIRLY
    };
}

export function getMango(){
    return {
        type: GET_MANGO
    };
}

export function toggleAirly(){
    return {
        type: TOGGLE_AIRLY
    }
}

export function toggleMango(){
    return {
        type: TOGGLE_AIRLY
    }
}

export function fetchPointsFromFile(opt){

    if(opt == "1"){
        return {
            type: FETCH_POINTS, payload: POINTS_1
        };
    }
    if(opt == "5"){
        return {
            type: FETCH_POINTS, payload: POINTS_5
        };
    }
    else{
        return {
            type: FETCH_POINTS, payload: POINTS_5
        };
    }
}


