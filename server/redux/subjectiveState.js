import {NORTH, EAST, SOUTH, WEST, POSITIONS} from '../../shared/constants/positions';

export default function subjectiveState(state, socketId) {
  const playerIndex = state.players.findIndex(p => p.sockets.find(s => s === socketId));
  if (!socketId) {
    console.error('socketId missing in subjectiveState');
    return state;
  }
  if (playerIndex === -1) {
    console.error('socketId not found in players', socketId);
    return state;
  }

  const playerId = state.players[playerIndex].id;

  const updatedPlayers = POSITIONS.map((position, i) => {
    const index = (playerIndex + i) % state.players.length;
    return {
      ...state.players[index],
      position,
      index,
    }
  })

  const updatedTeams = [] || state.teams.map(team => {
    if (team.players.includes(playerId)) team.name = 'NOUS';
    else team.name = 'EUX'
    return team;
  })

  return {
    ...state,
    players: updatedPlayers,
    teams: updatedTeams,
  };
};
