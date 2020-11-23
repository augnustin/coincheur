import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { LocalStateContext } from '../pages/GamePage.js';
import {selectIsDistributed, selectIsLastTrick, selectTricks, selectIsGameStarted} from '../redux/selectors';
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
import Declaration from './Declaration.js';
import ScoreReminder from './ScoreReminder.js';
import DeclarationReminder from './DeclarationReminder';

const Game = ({onTable, isDistributed, isLastTrick, isGameStarted, tricks}) => {
  const {tableId} = useContext(LocalStateContext);

  const GameTable = () => {
    return (
      <div>
        {!isGameStarted ? <Declaration /> : null}
        <div className="level-container">
          <div className="level is-mobile">
            <Player position={NORTH} />
            {isGameStarted ? <DeclarationReminder /> : null}
          </div>
          <div className="level is-mobile">
            <Player position={WEST} />
            <div className="level-item">
              <Table />
            </div>
            <Player position={EAST} />
          </div>
          <div className="level is-mobile">
            <Player position={SOUTH} />
            <ScoreReminder />
          </div>
        </div>
      </div>
    );
  }

  const GameComponent = () => {
    if (!isDistributed && !tricks.length) return <Controls />;

    return (isLastTrick) ? <Score /> : <GameTable />;
  }

  return GameComponent();
}

const mapStateToProps = createStructuredSelector({
  isDistributed: selectIsDistributed,
  isLastTrick: selectIsLastTrick,
  tricks: selectTricks,
  isGameStarted: selectIsGameStarted,
});

export default connect(mapStateToProps)(Game);