import {FETCH_MANGO, FETCH_POINTS} from "../actions";

export default function(state = [], action){

    switch(action.type){
        case "FETCH_POINTS2":
            console.log('dupa', [...state, action.payload]);
            return action.payload;
        case FETCH_POINTS:
            // console.log('GetAll ', action.payload);
            return action.payload;
    }
    return state;
}