import { combineReducers } from 'redux';
import finReducer from './finReducer';

export default combineReducers({
  list: finReducer,
});
