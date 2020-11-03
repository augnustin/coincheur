import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectIsDistributed,
  selectIsLastTrick,
  selectTricks,
  selectHasGameStarted
} from '../redux/selectors/game';
import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../../../shared/constants/positions';

import Table from './Table.js';
import Player from './Player.js';
import Controls from './Controls.js';
import Score from './Score.js';
import DeclarationForm from './DeclarationForm.js';
import ScoreReminder from './ScoreReminder.js';
import DeclarationReminder from './DeclarationReminder';

const Game = ({isDistributed, isLastTrick, hasGameStarted, tricks}) => {

  const GameTable = () => {
    return (
      <div>
        <div className="level-container">
          <div className="level is-mobile">
            <Player position={NORTH} />
          </div>
          <div className="level is-mobile">
            <Player position={WEST} />
            <div className="level-item">
            {!hasGameStarted ? <DeclarationForm /> : <Table />}
            </div>
            <Player position={EAST} />
          </div>
          <div className="level is-mobile">
            <Player position={SOUTH} />
          </div>
        </div>
      </div>
    );
  }

  if (!isDistributed && !tricks.length) return <Controls />;

  return (
    <div>
      <div className="score-container">
        <ScoreReminder onlyLast={true} />
        {hasGameStarted && <DeclarationReminder />}
      </div>
      {isLastTrick ? <Score /> : <GameTable />}
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  isDistributed: selectIsDistributed,
  isLastTrick: selectIsLastTrick,
  tricks: selectTricks,
  hasGameStarted: selectHasGameStarted,
});

export default connect(mapStateToProps)(Game);