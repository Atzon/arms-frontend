import { combineReducers } from 'redux';
import pointsReducer from './pointsReducer';
import airlyReducer from './airlyReducer';
import mangoReducer from './mangoReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
    points: pointsReducer,
    airly: airlyReducer,
    mango: mangoReducer,
    settings: settingsReducer
});

export default rootReducer;