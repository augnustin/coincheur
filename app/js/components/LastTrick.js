import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLastTrick, selectCurrentPlayer } from '../redux/selectors/game';
import { selectIsLastTrickVisible } from '../redux/selectors/local';
import { toggleIsLastTrickVisible } from '../redux/actions/localActions';
import {shift} from '../../../shared/utils/array';
import Card from './Card';

import '../../scss/components/LastTrick.scss';

const LastTrick = ({isLastTrickVisible, toggleIsLastTrickVisible, lastTrick, currentPlayer}) => {

  return (
    <div className={`overlay ${isLastTrickVisible ? 'is-visible' : ''}`} onClick={e => toggleIsLastTrickVisible()} >
      <div className="overlay-content">
        { (lastTrick) ?
          shift(lastTrick.cards, currentPlayer.index).map( c => <Card key={c} value={c} /> ) :
          "Aucun plis n'a été joué pour le moment"
        }
      </div>
    </div>
    );
  };

  const mapStateToProps = createStructuredSelector({
    lastTrick: selectLastTrick,
    isLastTrickVisible: selectIsLastTrickVisible,
    currentPlayer: selectCurrentPlayer,
  });

  const mapDispatchToProps = {
    toggleIsLastTrickVisible,
  }

  export default connect(mapStateToProps, mapDispatchToProps)(LastTrick);