import React, {useContext} from 'react';
import {connect} from 'react-redux';
import {selectTricks, selectPlayers, selectTeams} from '../redux/selectors';
import {newGame} from '../redux/actions';
import { LocalStateContext } from '../pages/GamePage.js';

import ScoreBoard from './ScoreBoard';
import Card from './Card';

const Score = ({players, tricks, teams, newGame}) => {

  const {tableId} = useContext(LocalStateContext);

  const teamTricks = teams.reduce((teamTricks, team) => {

    const playersTricks = team.players.reduce((playerTricks, playerId) => {
      const pIndex = players.findIndex(p => p.id === playerId);
      const cards =  tricks.find(({playerIndex}) => playerIndex === pIndex)
        ? tricks.find(({playerIndex}) => playerIndex === pIndex).cards
        : [];
      return [...playerTricks, ...cards];
    }, []);

    teamTricks[team.name] = playersTricks;
    return teamTricks;
  }, {});

  return (
    <div className="has-text-centered">
      <ScoreBoard />
      {
        Object.entries(teamTricks).map(([name, tricks]) => {
          return (
            <div key={name}>
              <h2>{name}</h2>
              <div className="hand">
              {
                tricks.length ? tricks.map(c => <Card key={c} value={c} />) : <div>Vous n'avez fait aucun plis</div>
              }
              </div>
            </div>
          );
        })
      }
      <button className="button is-primary is-large" onClick={() => newGame(tableId)} style={{marginTop: '2rem'}}>New game</button>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  newGame: (tableId) => dispatch(newGame(tableId)),
});

const mapStateToProps = (state) => ({
  players: selectPlayers(state),
  tricks: selectTricks(state),
  teams: selectTeams(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Score);