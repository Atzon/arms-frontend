import {FETCH_POINTS} from "../actions";

export default function(state = null, action){
    switch(action.type){
        case FETCH_POINTS:
            return action.payload;
    }
    return state;
}