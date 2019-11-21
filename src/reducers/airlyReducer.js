import {FETCH_AIRLY, GET_AIRLY} from "../actions";

let isLoaded = false;

export default function(state = [], action){
    switch(action.type){
        case FETCH_AIRLY:
            if(!isLoaded){
                console.log('FETCH_AIRLY ', [...state, action.payload]);
                isLoaded = true;
                return [...state, action.payload];   
            }
            break;
        case GET_AIRLY:
            console.log('GET_AIRLY ', state);
            return state;
    }
    return state;
}