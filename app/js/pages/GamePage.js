import React, { useState, useEffect, createContext } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';
import { subscribeServerUpdate, unsubscribeServerUpdate } from '../redux/actions/socketActions';
import Layout from '../components/Layout';
import Game from '../components/Game';
import {localStorageKeys} from '../constants';

const GamePage = ({subscribeServerUpdate, unsubscribeServerUpdate, match: {params: {tableId}}}) => {
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
    return () => {
      // unsubscribeServerUpdate(tableId);
    }
  }, []);

  return (
    <Layout>
      <Game />
    </Layout>
  );
};

const mapDispatchToProps = {
  subscribeServerUpdate,
  unsubscribeServerUpdate
}

export default connect(null, mapDispatchToProps)(GamePage);