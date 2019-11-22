import { combineReducers } from 'redux';
import pointsReducer from './pointsReducer';
import airlyReducer from './airlyReducer';
import mangoReducer from './mangoReducer';

const rootReducer = combineReducers({
    points: pointsReducer,
    airly: airlyReducer,
    mango: mangoReducer,
});

export default rootReducer;