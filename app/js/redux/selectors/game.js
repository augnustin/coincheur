import get from 'lodash.get';
import { createSelector } from 'reselect';
import {SOUTH} from '../../../../shared/constants/positions';
import {last, partition} from '../../../../shared/utils/array';
import {equals} from '../../../../shared/utils/player';
import declarationTypes from '../../../../shared/constants/declarationTypes';

export const selectTableId = state => get(state, 'game.tableId');
export const selectPlayers = state => get(state, 'game.players', []);
export const selectTricks = state => get(state, 'game.tricks', []);
export const selectDeck = state => get(state, 'game.deck', []);
export const selectDeclarationsHistory = state => get(state, 'game.declarationsHistory', []);
export const selectHasGameStarted = state => get(state, 'game.hasGameStarted');
export const selectScore = state => get(state, 'game.score', []);
export const selectPreferences = state => get(state, 'game.preferences', {});

export const selectNbPlayers = createSelector(
  [selectPlayers],
  (players) => players.length,
);

export const selectHumanPlayers = createSelector(
  [selectPlayers],
  players => players.filter(p => p.id)
);

export const selectPlayerByPosition = createSelector(
  [selectPlayers],
  players => position => players.find(player => player.position === position)
)

export const selectCurrentPlayer = createSelector(
  [selectPlayers],
  (players) => players.find(player => player.position === SOUTH)
);

export const selectActivePlayer = createSelector(
  [selectPlayers],
  players => players.find(p => p.isActivePlayer),
);

export const selectIsActivePlayer = createSelector(
  [selectCurrentPlayer, selectActivePlayer],
  (currentPlayer, activePlayer) => equals(currentPlayer, activePlayer),
);

export const selectIsDistributed = createSelector(
  [selectPlayers],
  players => players.filter(p => ((p.hand || []).length)).length
);

export const selectIsLastTrick = createSelector(
  [selectDeck, selectPlayers, selectTricks],
  (deck, players, tricks) => players.every(p => p.hand.length === 0),
);

export const selectOnTable = createSelector(
  [selectPlayers],
  players => players.filter(p => p.onTable).map(p => ({value: p.onTable, position: p.position}))
);

export const selectCanCollect = createSelector(
  [selectPlayers, selectOnTable],
  (players, onTable) => onTable.length === players.length,
);

export const selectLastTrick = createSelector(
  [selectTricks],
  (tricks) => tricks[0],
);

export const selectTeams = createSelector(
  [selectPlayers],
  players => partition(players.map(p => p.id), (p, i) => i%2)
)

export const selectTricksByTeam = createSelector(
  [selectTricks, selectCurrentPlayer],
  (tricks, currentPlayer) => tricks.reduce(([us, others], t) => {
    const isCurrentPlayerTeam = (t.playerIndex % 2) === (currentPlayer.index % 2)
    return [
      us.concat(isCurrentPlayerTeam ? t : []),
      others.concat(isCurrentPlayerTeam ? [] : t),
    ]
  }, [[], []])
)

export const selectPartner = createSelector(
  [selectPlayers, selectCurrentPlayer],
  (players, currentPlayer) => players.find(p => p.index !== currentPlayer.index && (p.index % 2) === (currentPlayer.index % 2))
);

export const selectCurrentDeclaration = createSelector(
  [selectDeclarationsHistory],
  (declarationsHistory) => last(declarationsHistory.filter(d => (d.type !== declarationTypes.PASS) && (d.type !== declarationTypes.COINCHE)))
)

export const selectIsCoinched = createSelector(
	[selectDeclarationsHistory],
	(declarationsHistory) => declarationsHistory.filter(d => d.type === declarationTypes.COINCHE),
);
