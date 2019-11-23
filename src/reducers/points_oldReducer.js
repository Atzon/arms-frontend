import {FETCH_POINTS_OLD} from "../actions";


export default function(state = null, action){

    switch(action.type){
        case FETCH_POINTS_OLD:
            return action.payload;
    }
    return state;
}