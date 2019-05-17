import { combineReducers } from 'redux';
import pointsReducer from './pointsReducer';

const rootReducer = combineReducers({
    points: pointsReducer
});

export default rootReducer;