import {TOGGLE_AIRLY, TOGGLE_MANGO} from "../actions";

export default function(state = {mango: true, airly: true}, action){
    switch(action.type){
        case TOGGLE_AIRLY:{
            console.log(!state.airly);
            return {...state, airly: !state.airly};
        }
        case TOGGLE_MANGO:{
            console.log(!state.mango);
            return {...state, mango: !state.mango};
        }
    }
    return state;
}