import {FETCH_MANGO, TOGGLE_MANGO } from "../actions";

export default function(state = {data: [], loaded: false, enabled: false}, action){
    switch(action.type){
        case FETCH_MANGO:
            if(!state.loaded){
                console.log('fetching mango not loaded ', {...state, data: action.payload, loaded: true, enabled: true});
                return {...state, data: action.payload, loaded: true};
            }
            else{
                console.log('fetching mango loaded ', state);
                return state;
            }
        case TOGGLE_MANGO:
            console.log("mango enabled:", {...state, enabled: !state.enabled});
            return {...state, enabled: !state.enabled};
        default:
            return state;
    }
}