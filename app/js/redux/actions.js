import actionTypes from './actionsTypes';
import socketEvents from '../../../shared/constants/socketEvents';

export function subscribeServerUpdate(tableId, username) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    listenSocketEvent: socketEvents.UPDATED_STATE,
    dispatchOnSocketEvent: actionTypes.UPDATED_SERVER_STATE,
    emit: socketEvents.JOIN,
    payload: {
      tableId,
      username,
    },
  }
}

export function unsubscribeServerUpdate(tableId) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    stopListeningSocketEvent: socketEvents.UPDATED_STATE,
    emit: socketEvents.LEAVE,
    payload: {tableId},
  }
}

export function distribute(tableId, playerId) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.DISTRIBUTE,
        payload: {playerId},
      }
    }
  }
}

export function swichTeams(tableId, indexes) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.SWITCH_TEAMS,
        payload: {indexes}
      }
    }
  }
}

export function playCard(tableId, card) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.PLAY_CARD,
        payload: card
      }
    }
  }
};

export function getCardBack(tableId, card) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.CARD_BACK,
        payload: card
      }
    }
  }
};

export function collect(tableId, playerIndex) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.COLLECT,
        payload: {playerIndex}
      }
    }
  }
};

export function newGame(tableId) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.NEW_GAME,
        payload: {},
      }
    }
  }
}

export function undo(tableId) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.UNDO,
        payload: {},
      }
    }
  }
}

export function declare(tableId, playerId, declaration) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.DECLARE,
        payload: {playerId, declaration},
      }
    }
  }
}

export function launchGame(tableId) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.LAUNCH_GAME,
        payload: {},
      }
    }
  }
}

export function getScore(tableId) {
  return {
    type: actionTypes.NO_LOCAL_EFFECT,
    emit: socketEvents.DISPATCH,
    payload: {
      tableId,
      action: {
        type: actionTypes.GET_SCORE,
        payload: {},
      }
    }
  }
}