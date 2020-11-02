import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import {localStorageKeys, queryParamToJoin} from '../constants';

const LandingPage = (props) => {

  const isJoiningTableId = new URLSearchParams(props.location.search).get(queryParamToJoin);

  const [username, setUsername] = useState(localStorage.getItem(localStorageKeys.USERNAME) || '');
  const [mayNeedHelp, _setMayNeedHelp] = useState(!localStorage.getItem(localStorageKeys.USERNAME) && !isJoiningTableId);
  const [tableId, setTableId] = useState(isJoiningTableId || '');

  const setUsernameAndSave = value => {
    setUsername(value);
    localStorage.setItem(localStorageKeys.USERNAME, value);
  };

  const joinTable = (e) => {
    e.preventDefault();
    fetch(`/join`, {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `tableId=${tableId}`,
    })
    .then(res => {
      props.history.push(res.url.replace(`${window.location.protocol}//${window.location.host}`, ''));
    })
  };

  return (
    <Layout mode="container">
      <form className="section is-vertical has-text-centered" action="/join" method="post" onSubmit={e => joinTable(e)}>
        <h1 className="title is-1">Bienvenue</h1>
        <p className="subtitle">Ici les cartes n'ont pas le COVID</p>
        {mayNeedHelp && (
          <p>
            <Link className="button is-primary" to="/help">Comment ça marche ?</Link>
          </p>
        )}
        <div className="section is-vertical">
          <div className="field">
            <input style={{maxWidth: '300px'}} className="input is-large" type="text" placeholder="Choisissez votre pseudo" maxLength="20" value={username} onChange={e => setUsernameAndSave(e.target.value)} required />
          </div>
        </div>
        <div className="section is-vertical">
          { !isJoiningTableId ? (
            <div>
              <div className="field">
                <button className="button is-primary is-large">Créer une table</button>
              </div>
              <p className="section has-text-centered">- OU -</p>
            </div>
          ) : (
            <p className="field">On t'attend pour jouer sur cette table :</p>
          )}
          <div className="field has-addons">
            <div className="control is-expanded">
              <input className="input" type="text" placeholder="Entrez un nom de table ..." value={tableId} onChange={(e) => setTableId(e.target.value)} />
            </div>
            <div className="control">
              <button className="button is-primary">
                Rejoindre
              </button>
            </div>
        </div>
        </div>
      </form>
    </Layout>
  );
};

export default LandingPage;