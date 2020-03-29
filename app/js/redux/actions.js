import actionTypes from './actions.types';

export function subscribeServerUpdate(tableId) {
  return {
    type: 'server/connect',
    event: 'updated_state',
    handle: actionTypes.UPDATED_SERVER_STATE,
    emit: 'join',
    payload: {tableId},
  }
}

export function unsubscribeServerUpdate(tableId) {
  return {
    type: 'server/disconnect',
    event: 'updated_state',
    leave: true,
    payload: {tableId},
  }
}

export function distribute(tableId) {
  return {
    type: 'server/dispatch',
    emit: 'dispatch',
    payload: {
      tableId,
      action: {
        type: actionTypes.DISTRIBUTE,
      }
    }
  }
}

export function playCard(tableId, playerId, card) {
  return {
    type: 'server/dispatch',
    emit: 'dispatch',
    payload: {
      tableId,
      action: {
        type: actionTypes.PLAY_CARD,
        payload: {playerId, card}
      }
    }
  }
};

export function collect(tableId, cards) {
  return {
    type: 'server/dispatch',
    emit: 'dispatch',
    payload: {
      tableId,
      action: {
        type: actionTypes.COLLECT,
        payload: cards
      }
    }
  }
};


// // Action creator with received function:
// export function subscribeConversation() {
//   return dispatch => dispatch({
//     event: 'message',
//     handle: data => dispatch({
//       type: actionTypes.NEW_MESSAGE,
//       payload: data.message,
//     }),
//   });
// }
