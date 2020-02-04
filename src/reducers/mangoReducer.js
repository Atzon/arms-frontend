import {DISABLE_MANGO, ENABLE_MANGO, FETCH_MANGO, TOGGLE_MANGO} from "../actions";

export default function(state = {data: [], loaded: false, enabled: false}, action){
    switch(action.type){
        case FETCH_MANGO:
            if(!state.loaded){
                return {...state, data: action.payload, loaded: true};
            }
            else{
                return state;
            }
        case TOGGLE_MANGO:
            return {...state, enabled: !state.enabled};
        case ENABLE_MANGO:
            return {...state, enabled: true};
        case DISABLE_MANGO:
            return {...state, enabled: false};
        default:
            return state;
    }
}