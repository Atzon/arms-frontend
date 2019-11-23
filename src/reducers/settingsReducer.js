import {DISABLE_AIRLY, DISABLE_MANGO, ENABLE_AIRLY, ENABLE_MANGO, THEME_CHANGE} from "../actions";
import {MANGO, AIRLY} from "../utils/utils";

const initialState = {
    theme: 'mapbox://styles/mapbox/light-v10',
    sources: []
};
export default function(state = initialState, action){

    switch(action.type){
        case THEME_CHANGE:
            return {...state, theme: action.theme};
        case ENABLE_AIRLY:
            return {
                ...state,
                sources:
                    [...state.sources,
                        state.sources.indexOf(AIRLY) === -1 ? AIRLY: []]};
        case ENABLE_MANGO:
            return {
                ...state,
                sources:
                    [...state.sources,
                        state.sources.indexOf(MANGO) === -1 ? MANGO: []]};
        case DISABLE_AIRLY:
            return {...state, sources: state.sources.filter(s => s != AIRLY)};
        case DISABLE_MANGO:
            return {...state, sources: state.sources.filter(s => s != MANGO)};
        default:
            return state;
    }
}