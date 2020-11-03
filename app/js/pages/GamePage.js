import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';
import { subscribeServerUpdate, unsubscribeServerUpdate } from '../redux/actions/socketActions';
import {selectGameId} from '../redux/selectors/game'
import Layout from '../components/Layout';
import Game from '../components/Game';
import {localStorageKeys} from '../constants';

const GamePage = ({gameId, subscribeServerUpdate, unsubscribeServerUpdate, match: {params: {tableId}}}) => {
  if (!tableId) return (
    <Redirect to="/" />
  );
  const username = localStorage.getItem(localStorageKeys.USERNAME);
  if (!username) return (
    <Redirect to={`/?join=${tableId}`} />
  );

  useBeforeunload(() => {
    unsubscribeServerUpdate(tableId)
  });

  useEffect(() => {
    subscribeServerUpdate(tableId, username)
    // return () => {
    //   // unsubscribeServerUpdate(tableId);
    // }
  }, [gameId]);

  return (
    <Layout>
      <Game />
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  gameId: selectGameId,
});


const mapDispatchToProps = {
  subscribeServerUpdate,
  unsubscribeServerUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);