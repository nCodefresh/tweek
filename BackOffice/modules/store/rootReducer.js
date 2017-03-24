import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import keysReducer from './ducks/keys';
import selectedKeyReducer from './ducks/selectedKey';
import tagsReducer from './ducks/tags';

export default (combineReducers(
  {
    keys: keysReducer,
    selectedKey: selectedKeyReducer,
    routing: routerReducer,
    tags: tagsReducer,
  }
));