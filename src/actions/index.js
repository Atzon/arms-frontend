import axios from 'axios';
import POINTS_1 from './5lines2.json';
import POINTS_5 from './5lines2.json';

const ROOT_URL = 'https://arms-backend-server.herokuapp.com/api';
//const ROOT_URL = 'http://localhost:3000/api';


export const FETCH_POINTS = 'FETCH_POINTS';
export const FETCH_POINTS_MANGO = 'FETCH_POINTS_MANGO';
export const FETCH_POINTS_AIRLY = 'FETCH_POINTS_AIRLY';


export function fetchPoints(){

    const request = axios.get(`${ROOT_URL}/points`);

    return(dispatch) => {
        request.then(({data}) =>{
            dispatch({type: FETCH_POINTS, payload: data});
        });
    };
}

export function fetchPoints2(){

    const request = axios.get(`${ROOT_URL}/points`);

    return(dispatch) => {
        request.then(({data}) =>{
            dispatch({type: FETCH_POINTS_AIRLY, payload: data});
        });
    };
}

export function fetchPointsFromFile2(){
    return {
        type: FETCH_POINTS_AIRLY, payload: POINTS_5
    };
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

export function removePointsFromFile(){
    return {
        type: FETCH_POINTS_MANGO, payload: []
    };
}

export function removePoints(){
    return {
        type: FETCH_POINTS_AIRLY, payload: []
    }
}
