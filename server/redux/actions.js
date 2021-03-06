import actionTypes from './actionTypes';

export function join(payload) {
  return {
    type: actionTypes.JOIN,
    payload,
  }
}

export function leave(payload) {
  return {
    type: actionTypes.LEAVE,
    payload,
  }
}
