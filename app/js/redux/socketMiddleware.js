import {last} from '../../../shared/utils/array';
import io from 'socket.io-client';
import socketEvents from '../../../shared/constants/socketEvents';
import store from './store';
import {selectTableId} from './selectors/game';

const dispatchWithTableId = payload => {
  return {
    tableId: selectTableId(store.getState()),
    ...payload
  }
}

export default function socketMiddleware() {
  const socket = io.connect('');

  return ({ dispatch }) => next => (action) => {
    if (typeof action === 'function') {
      return next(action);
    }

    const { listenSocketEvent, stopListeningSocketEvent, dispatchOnSocketEvent, emit: socketEvent, payload } = action;

    if (listenSocketEvent && dispatchOnSocketEvent) {
      socket.on(listenSocketEvent, socketPayload => {
        dispatch({ type: dispatchOnSocketEvent, payload: socketPayload })
      });
    }

    if (socketEvent) {
      console.log(payload)
      socket.emit(
        socketEvent,
        socketEvent === socketEvents.DISPATCH ?
          dispatchWithTableId(payload) :
          payload
      );
    }

    if (stopListeningSocketEvent) {
      socket.removeListener(stopListeningSocketEvent);
    }

    return next(action);
  };
}

