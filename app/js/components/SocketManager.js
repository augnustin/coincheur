import React, { createContext, useContext, useState, useEffect } from 'react';
import useSocket from './useSocket';
import {DECK32, DECK52} from '../constants/decks';
import {
  POSITIONS,
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../constants/positions';
import {shuffle} from '../utils/array';

const INITIAL_STATE = {
  deck: shuffle(DECK32),
  isDistributed: false,
  onTable: [],
  players: [{
    position: SOUTH,
    name: 'Me',
    hand: [],
    tricks: [],
    isFirstPerson: true,
  }, {
    position: WEST,
    name: 'Ennemi à abattre 1',
    hand: [],
    tricks: [],
    isVirtual: true,
    isDealer: true,
  }, {
    position: NORTH,
    name: 'Copaing',
    hand: [],
    tricks: [],
    isVirtual: true,
  }, {
    position: EAST,
    name: 'Ennemi à abattre 2',
    hand: [],
    tricks: [],
    isVirtual: true,
  }],
  score: '',
};

export const SocketContext = createContext({socket: null, state: INITIAL_STATE});

export const useSocketContext = () => React.useContext(SocketContext);


const SocketManager = (props) => {

  const [state, setState] = useState({socket: null, state: INITIAL_STATE});

  const [socket] = useSocket('http://localhost:3000');

  useEffect(() => {
    socket.connect();
    setState({...state, socket: socket})

    socket.on('newState', state => setState({...socket, state: state}));

  }, []);

  return (
    <SocketContext.Provider value={state}>
      {props.children}
    </SocketContext.Provider>
  );

}

export default SocketManager;