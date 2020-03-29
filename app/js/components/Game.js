import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { distributeSocket, distribute } from '../redux/actions';
import { useSocketContext } from './SocketManager';

import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
} from '../constants/positions';

import Table from './Table.js';
import Player from './Player.js';
import Header from './Header.js';

const Game = (props) => {
  const {tableId, username} = props.match.params;

  const {state, socket} = useSocketContext();
  const {onTable,
          isDistributed,
          deck,
          dealerIndex,
          nbPlayers,
          players,
        } = state;


  const handleClick = () => {
    socket.emit('distribute', distribute());
  }

  return (
    <div>
      {
        !isDistributed ? (
          <ul className="commands">
            <li>
              <button onClick={handleClick} className="button is-primary is-large is-rounded">Distribuer une partie</button>
            </li>
          </ul>
        ) : (
          <div className="level-container">
            <div className="level is-mobile">
              <Player position={NORTH} />
            </div>
            <div className="level is-mobile">
              <Player position={WEST} />
              <div className="level-item">
                <Table cards={onTable} />
              </div>
              <Player position={EAST} />
            </div>
            <div className="level is-mobile">
              <Player position={SOUTH} />
            </div>
          </div>
        )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  deck: state.deck,
  isDistributed: state.isDistributed,
  dealerIndex: state.players.findIndex(p => p.isDealer),
  nbPlayers: state.players.length,
  onTable: state.onTable,
  players: state.players,
});

const mapDispatchToProps = (dispatch) => ({
  distributeSocket: (socket, table, deck, dealerIndex, nbPlayers) => dispatch(distributeSocket(socket, table, deck, dealerIndex, nbPlayers)),
  distribute: (hands) => dispatch(distribute(hands)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);