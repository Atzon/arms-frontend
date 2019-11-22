import {FETCH_AIRLY, TOGGLE_AIRLY} from "../actions";

export default function(state = {data: [], loaded: false, enabled: false}, action){
    switch(action.type){
        case FETCH_AIRLY:
            if(!state.loaded){
                console.log('fetching airly not loaded ', {...state, data: action.payload, loaded: true, enabled: true});
                return {...state, data: action.payload, loaded: true};
            }
            else{
                console.log('fetching airly loaded ', state);
                return state;
            }
        case TOGGLE_AIRLY:
            return {...state, enabled: !state.enabled};
        default:
            return state;
    }
}