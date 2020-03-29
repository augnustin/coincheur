import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './root-reducer';
import INITIAL_STATE from './root-reducer';
import redisInstance, {redisKey} from '../redis';

const storeToRedis = store => next => action => {
  next(action);
  return redisInstance.set(redisKey, store.getState()).then(v => console.log(v))
}

const middlewares = [storeToRedis].concat(process.env.NODE_ENV === 'development' ? logger : []);

//Commented code below is not working. Must look into it. For the sake of the proof of concept 

// const getStore = async redisKey => {
//   const redisState = await redisInstance.get(redisKey) || INITIAL_STATE;
//   return createStore(rootReducer, redisState, applyMiddleware(...middlewares));
// };

// const store =getStore(redisKey);

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;