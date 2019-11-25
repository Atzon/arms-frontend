import { combineReducers } from 'redux';
import pointsReducer from './pointsReducer';
import airlyReducer from './airlyReducer';
import mangoReducer from './mangoReducer';
import settingsReducer from './settingsReducer';
import points_oldReducer from "./points_oldReducer";
import testReducer from "./testReducer";

const rootReducer = combineReducers({
    points: pointsReducer,
    pointsOld: points_oldReducer,
    airly: airlyReducer,
    mango: mangoReducer,
    settings: settingsReducer,
    test: testReducer
});

export default rootReducer;