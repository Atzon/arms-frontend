import {FETCH_MANGO, GET_MANGO, fetchPoints} from "../actions";

let isLoaded = false;

export default function(state = [], action){
    switch(action.type){
        case FETCH_MANGO:
            if(!isLoaded){
                console.log('FETCH_MANGO ', [...state, action.payload]);
                isLoaded = true;
                return [...state, action.payload];
            }
            break;
        case GET_MANGO:
            console.log('GET_MANGO ', state);
            return state;
    }
    return state;
}