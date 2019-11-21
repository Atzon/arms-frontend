import {FETCH_POINTS_MANGO} from "../actions";

export default function(state = [], action){
    switch(action.type){
        case FETCH_POINTS_MANGO:
            return action.payload;
    }
    return state;
}