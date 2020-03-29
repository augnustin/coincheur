import React, { useState } from 'react';
import Layout from '../components/Layout';

const LandingPage = (props) => {

  const [username, setUsername] = useState('');
  const [tableId, setTableId] = useState('');

  const joinTable = (e) => {
    e.preventDefault();
    fetch(`/join`, {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `tableId=${tableId}&username=${username}`,
    })
    .then(res => {
      props.history.push(res.url.replace(`${window.location.protocol}//${window.location.host}`, ''));
    })
  };

  return (
    <Layout>
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <form className="section has-text-centered" action="/join" method="post">
            <h1 className="title is-1">Bienvenue</h1>

            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Pseudo</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input className="input" type="text" placeholder="Choisis ton blase" value={username} onChange={e => setUsername(e.target.value)} />
                  </p>
                </div>
              </div>
            </div>
            <div className="section content">
              <div className="field">
                <button className="button is-primary" onClick={joinTable}>Créer une table</button>
              </div>
              <p className="has-text-centered">- OU -</p>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input className="input" type="text" placeholder="Entrez un nom de table ..." value={tableId} onChange={(e) => setTableId(e.target.value)} />
                </div>
                <div className="control">
                  <button className="button is-primary" onClick={joinTable}>
                    Rejoindre
                  </button>
                </div>
            </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;