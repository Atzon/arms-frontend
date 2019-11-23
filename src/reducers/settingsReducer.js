import {THEME_CHANGE} from "../actions";
import {MANGO, AIRLY} from "../utils/utils";

const initialState = {
    theme: 'mapbox://styles/mapbox/light-v10',
    sources: [MANGO]
};
export default function(state = initialState, action){

    switch(action.type){
        case THEME_CHANGE:
            return {...state, theme: action.theme};
        default:
            return state;
    }
}