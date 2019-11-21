import { combineReducers } from 'redux';
import pointsReducer from './pointsReducer';
import airlyReducer from './airlyReducer';
import mangoReducer from './mangoReducer';
import enabled from './enabled';
import loaded from './loaded';

const rootReducer = combineReducers({
    points: pointsReducer,
    airly: airlyReducer,
    mango: mangoReducer,
    enabled: enabled,
    loaded: loaded,
});

export default rootReducer;