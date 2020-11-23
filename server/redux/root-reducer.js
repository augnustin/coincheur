import { combineReducers } from 'redux';
import actionTypes from './actionTypes';
import {DECK32, DECK52} from '../constants/decks';
import { sortHand, distribute, distributeCoinche, cutDeck } from '../utils/coinche';
import {NORTH, EAST, SOUTH, WEST} from '../../shared/constants/positions';
import {shuffle, switchIndexes} from '../../shared/utils/array';


export const INITIAL_STATE = {
  deck: shuffle(DECK32),
  isGameStarted: false,
  currentDeclaration: null,
  declarationsHistory: null,
  teams: [],
  tricks: [],
  players: Array(4).fill({
    name: null,
    id: null,
    hand: [],
    sockets: [],
    disconnected: false,
  }),
  preferences: {},
  score: null,
};


const rootReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.JOIN:
      const {playerId, playerName, socketId} = action.payload;
      const samePlayerIndex = state.players.findIndex(p => p.id === playerId);
      const firstAvailableIndex = state.players.findIndex(p => !p.id);
      const firstDisconnectedIndex = state.players.findIndex(p => p.disconnected);
      const newPlayerIndex = [samePlayerIndex, firstAvailableIndex, firstDisconnectedIndex].find(i => i > -1);
      if (newPlayerIndex === undefined) return state;
      return {
        ...state,
        players: state.players.map((p, i) => {
          if (newPlayerIndex === i) {
            return {
              ...p,
              id: playerId,
              name: playerName || p.name || `Joueur ${i+1}`,
              sockets: p.sockets.concat(socketId),
              disconnected: false,
            }
          } else {
            return p;
          }
        })
      }
    case actionTypes.LEAVE:
      return {
        ...state,
        players: state.players.map(p => {
          const filteredSockets = p.sockets.filter(s => s !== action.payload);
          return {
            ...p,
            sockets: filteredSockets,
            disconnected: p.id && filteredSockets.length === 0,
          }
        })
      }
    case actionTypes.SWITCH_TEAMS: {
      const [i1, i2] = action.payload.indexes;
      const i1PartnerIndex = state.players.findIndex((p, i) => {
        return i !== i1 && (i % 2) === (i1 % 2);
      });
      return {
        ...state,
        players: switchIndexes(state.players, i1PartnerIndex, i2),
      }
    }
    case actionTypes.DISTRIBUTE: {
      const dealerId = action.payload.playerId;
      const dealerIndex = state.players.findIndex(p => p.id === dealerId);
      console.log(dealerIndex)
      const playersWithDealer = state.players.map(p => ({
        ...p,
        hand: (p.hand.length) ? [] : p.hand,
        onTable: null,
        isDealer: p.id === dealerId,
      }));

      // const playersWithCards = distribute(state.deck, playersWithDealer, dealerIndex);
      const playersWithCards = distributeCoinche(state.deck, playersWithDealer, dealerIndex);

      return {
        ...state,
        tricks: [],
        players: playersWithCards
      };
    }
    case actionTypes.PLAY_CARD: {
      const card = action.payload;
      const playingPlayerIndex = state.players.findIndex(p => p.hand.find(c => c === card));

      return {
        ...state,
        players: state.players.map((p, i) => {
          if (i === playingPlayerIndex) {
            return {
              ...p,
              hand: sortHand(p.hand.filter(c => c !== card).concat(p.onTable || [])),
              onTable: card,
            }
          } else {
            return p;
          }
        }),
      }
    };
    case actionTypes.CARD_BACK: {
      const card = action.payload;
      const playingPlayerIndex = state.players.findIndex(p => p.onTable === card);

      return {
        ...state,
        players: state.players.map((p, i) => {
          if (i === playingPlayerIndex) {
            return {
              ...p,
              hand: sortHand(p.hand.concat(card)),
              onTable: null,
            }
          } else {
            return p;
          }
        }),
      }
    };
    case actionTypes.COLLECT: {
      const {playerIndex} = action.payload;

      const newTrick = {
        playerIndex,
        cards: state.players.map(p => p.onTable),
      };
      if (newTrick.cards.length < state.players.length) {
        return state;
      }
      return {
        ...state,
        tricks: [newTrick, ...state.tricks],
        players: state.players.map((p, i) => {
          return {
            ...p,
            onTable: null,
          }
        })
      }
    };
    case actionTypes.NEW_GAME: {

      const dealerIndex = state.players.findIndex(p => p.isDealer)

      // A refactorer aussi, très moche !
      const tricks = state.players.map((p, index) => {
        return state.tricks.filter(({playerIndex}) => index === playerIndex)
          .reduce((tricks, trick) => tricks.concat(trick.cards), [])
      })

      // Rassemble les cartes en gardant les plis des équipes.
      // très moche, à refactorer
      const newDeck = [].concat(tricks[0]).concat(tricks[2]).concat(tricks[1]).concat(tricks[3]);
      const resetedPlayers = state.players.map((p, index) => {
        return {
          ...p,
          hand: [],
          onTable: null,
          isDealer: (index === (dealerIndex + 1) % state.players.length),
        }
      });

      const newDealerIndex = state.players.findIndex(p => p.isDealer);
      const playersWithCards = distributeCoinche(newDeck, resetedPlayers, newDealerIndex);

      return {
        ...state,
        deck: newDeck,
        tricks: [],
        players: playersWithCards,
      };
    };

    default:
      return state;
  };
};

export default rootReducer;