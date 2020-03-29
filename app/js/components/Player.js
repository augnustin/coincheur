import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {SOUTH, NORTH} from '../constants/positions';
import {pluralize} from '../utils/string';
import {random} from '../utils/array';
import { playCard } from '../redux/actions';
import { useSocketContext } from './SocketManager';

import '../../scss/components/player.scss';

import Hand from './Hand.js';
// import Tricks from './Tricks.js';

const Player = ({position, playRandomCard}) => {
  // This is just a proof of concept for now. All the redux parts need to be removed in the future !
  const {state, socket} = useSocketContext();
  const player = state.players.find(p => (p.position === position))
  if (!player) return null;

  const { name,
          isFirstPerson,
          isDealer,
          hand,
          tricks,
          isVirtual,
        } = player;

  const $name = <p onClick={e => playRandomCard(hand)} className={`name ${isDealer ? 'is-dealer' : ''}`}>{isVirtual ? 'BOT' : name} ({pluralize(tricks.length, 'pli')})</p>;

  return (
    <div className={`player is-${position}`}>
      {position !== NORTH && $name}
      <Hand cards={hand} isSelectable={isFirstPerson} isHidden={!isFirstPerson} style={position === SOUTH ? "normal" : "compact"} />
      {position === NORTH && $name}
    </div>
  );
}

Player.propTypes = {
  position: PropTypes.string.isRequired,
  player: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  player: state.players.find(p => (p.position === ownProps.position)),
});

const mapDispatchToProps = (dispatch) => ({
  playRandomCard: hand => dispatch(playCard(random(hand))),
})

export default connect(mapStateToProps, mapDispatchToProps)(Player);

