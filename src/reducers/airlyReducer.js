import {FETCH_POINTS_AIRLY} from "../actions";

export default function(state = [], action){
    switch(action.type){
        case FETCH_POINTS_AIRLY:
            return action.payload;
    }
    return state;
}