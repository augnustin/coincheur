import React, {useState} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {pluralize} from '../../../shared/utils/string';
import {last} from '../../../shared/utils/array';
import {
  selectHumanPlayers,
  selectCurrentPlayer,
  selectPlayers,
  selectTableId,
  selectPreferences,
} from '../redux/selectors/game';
import {queryParamToJoin} from '../constants';
import { distribute, swichTeams, setPreference } from '../redux/actions/socketActions';
import '../../scss/components/controls.scss';
import {HTML_POSITIONS} from '../../../shared/constants/positions';
import {
  NO_DECLARATION,
  FINAL_DECLARATION,
  DECLARATIONS,
} from '../../../shared/constants/options';

const Controls = ({humanPlayers, currentPlayer, distribute, swichTeams, players, tableId, preferences, setPreference}) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(`${document.location.origin}?${queryParamToJoin}=${tableId}`);
    setIsCopied(true);
  }

  const disableDistribute = humanPlayers.length !== players.length;
  const sortedPlayers = players.sort((p1, p2) => HTML_POSITIONS.indexOf(p1.position) - HTML_POSITIONS.indexOf(p2.position))
  const southPlayer = last(sortedPlayers);
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const explanations = {
    [NO_DECLARATION]: "Vous faites les enchères à l'oral, et notez le score sur papier.",
    [FINAL_DECLARATION]: "Vous faites les enchères à l'oral, puis saisissez le contrat pour lancer la partie.",
    [DECLARATIONS]: "Vous faites les enchères dans l'application.",
  }

  return (
    <div className="commands has-text-centered">
      <div className="wrapper">
        <div className="section is-vertical is-small waiting">
          <h2 className="title is-4">{pluralize(humanPlayers.length, 'joueur prêt')} :</h2>
          {players.length ? (
            <ul className="players-waiting-list">
              {sortedPlayers.map((p, i) => (
                <li key={i}>
                  { p.id ? (
                      <button className="button is-text" onClick={e => swichTeams([southPlayer.index, p.index])}>{p.name}</button>
                    ) : <span>En attente ...</span>
                  }
                </li>
              )
            )}
            </ul>
          ) : null}
          {humanPlayers.length >= 2 && <p><small>Clique sur le nom d'un autre joueur pour rejoindre son équipe, et sur le tiens pour échanger les places des joueurs adverses.</small></p>}
        </div>
        <ul className="section is-vertical is-small actions">
          <li>
            <div className="field is-small has-addons has-addons-centered">
              <p className="control">
                <a className="button is-small is-static is-rounded">
                  Mode
                </a>
              </p>
              <p className="control">
                <span className="select is-small">
                  <select onChange={e => setPreference({declarationMode: e.target.value})} value={preferences.declarationMode}>
                    <option value={NO_DECLARATION}>Jeu de la carte uniquement</option>
                    <option value={DECLARATIONS}>Avec annonces</option>
                    <option value={FINAL_DECLARATION}>Annonce finale uniquement</option>
                  </select>
                </span>
              </p>
            </div>
            <p><small>{explanations[preferences.declarationMode]}</small></p>
          </li>
          <li>
            <button
              onClick={() => distribute(currentPlayer.index)}
              className="button is-primary is-large"
              title={disableDistribute ? 'Il faut 4 joueurs pour démarrer une partie' : ''}
              disabled={disableDistribute}
            >
              <span>Distribuer</span>
              <span className="is-hidden-mobile">&nbsp;une partie</span>
            </button>
          </li>
          {isDevelopment && disableDistribute && <li><button className="button is-text is-small" onClick={e => distribute(currentPlayer.index)}>(Forcer)</button></li>}
          <li>
            <button className={`button ${disableDistribute ? 'is-primary' : 'is-text'}`} onClick={copyUrlToClipboard}>
              {isCopied ? 'Copié !' : <span>Copier l'URL<span className="is-hidden-mobile"> à partager pour rejoindre la partie</span></span>}
            </button>
            <p className="is-hidden-tablet">à partager pour rejoindre la partie</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  tableId: selectTableId,
  currentPlayer: selectCurrentPlayer,
  humanPlayers: selectHumanPlayers,
  players: selectPlayers,
  preferences: selectPreferences,
});

const mapDispatchToProps = {
  distribute,
  swichTeams,
  setPreference,
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);