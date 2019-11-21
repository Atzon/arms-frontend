import {LOADED_AIRLY, LOADED_MANGO} from "../actions";

export default function(state = {mango: false, airly: false}, action){
    switch(action.type){
        case LOADED_AIRLY:{
            return {...state, airly: true};
        }
        case LOADED_MANGO:{
            return {...state, mango: true};
        }
    }
    return state;
}