import axios from 'axios';
import POINTS_1 from './5lines2.json';
import POINTS_5 from './5lines2.json';

const ROOT_URL = 'https://arms-backend-server.herokuapp.com/api';
//const ROOT_URL = 'http://localhost:3000/api';


export const FETCH_POINTS = 'FETCH_POINTS';
export const FETCH_MANGO = 'FETCH_MANGO';
export const FETCH_AIRLY = 'FETCH_AIRLY';
export const TOGGLE_MANGO = 'TOGGLE_MANGO';
export const TOGGLE_AIRLY = 'TOGGLE_AIRLY';

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

export function toggleMango(){

    return (dispatch, getState) => {
        const { mango } = getState();

        if(!mango.loaded)
            dispatch(fetchMango());

        dispatch({type: TOGGLE_MANGO});
        dispatch(fetchPoints());
    };
}


