import actionTypes from './actions.types';

export function distribute() {
  return {
    type: actionTypes.DISTRIBUTE,
    payload: {},
  }
};

// export function distribute(hands) {
//   return {
//     type: actionTypes.DISTRIBUTE,
//     payload: hands,
//   }
// };

export function playCard(card) {
  return {
    type: actionTypes.PLAY_CARD,
    payload: card,
  }
};

export function collect(cards) {
  return {
    type: actionTypes.COLLECT,
    payload: cards
  }
};

export function distributeSocket(socket, table, deck, dealerIndex, nbPlayers) {
  return dispatch => {
    const hands = makeHands(deck, dealerIndex, nbPlayers);
    console.log(hands)
    socket.emit('cardsDistributed', {
      table: table,
      hands: JSON.stringify(hands),
    });
  }
}

const makeHands = (deck, dealerIndex, nbPlayers) => {

  const hands = deck.reduce((hands, card, deckIndex) => {
    const nextPlayerIndex = (dealerIndex + deckIndex) % nbPlayers;
    return hands.map((hand, playerIndex) => {
      if (nextPlayerIndex === playerIndex) {
          return [...hand, card]
      } else {
        return hand;
      }
    })
  }, [[], [], [], []]);

  return hands;
};
