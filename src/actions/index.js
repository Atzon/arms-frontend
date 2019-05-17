import axios from 'axios';

const ROOT_URL = 'https://arms-backend-server.herokuapp.com/api';


export const FETCH_POINTS = 'FETCH_LESSONS';

export function fetchPoints(){

    const request = axios.get(`${ROOT_URL}/points`);

    return(dispatch) => {
        request.then(({data}) =>{
            dispatch({type: FETCH_POINTS, payload: data});
        });
    };
}
