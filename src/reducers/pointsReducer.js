import {FETCH_POINTS, CHANGE_HOUR} from "../actions";

const initialState = {
    data: [],
    hour: new Date().getHours()
};

export default function(state = initialState, action){

    switch(action.type){
        case FETCH_POINTS:
            return {...state, data: action.payload};
        case CHANGE_HOUR:
            return {...state, hour: action.hour};
    }
    return state;
}