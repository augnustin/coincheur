import {socketActionTypes} from '../actionsTypes';

const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case socketActionTypes.UPDATED_SERVER_STATE:
      return action.payload;
    case socketActionTypes.RESET_LOCAL_GAME:
      return state;
    default:
      return state;
  };
};