import {FETCH_MANGO, FETCH_POINTS} from "../actions";

export default function(state = [], action){

    switch(action.type){
        case FETCH_POINTS:
            console.log('GetAll ', action.payload);
            return state;
        case FETCH_MANGO:
            return action.payload;
    }
    return state;
}