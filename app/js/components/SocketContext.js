import React, { createContext, useContext } from 'react';

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

export const SocketContext = createContext(INITIAL_STATE);
