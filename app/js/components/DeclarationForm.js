import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { declare, launchGame, distribute, finalDeclare } from '../redux/actions/socketActions';
import { createStructuredSelector } from 'reselect';
import Declaration from './Declaration';
import {trumpNames} from '../../../shared/constants/trumpTypes';
import declarationTypes from '../../../shared/constants/declarationTypes';
import {FINAL_DECLARATION} from '../../../shared/constants/options';
import { first, last, range } from '../../../shared/utils/array';
import {
  selectPlayers,
  selectCurrentPlayer,
  selectIsActivePlayer,
  selectActivePlayer,
  selectDeclarationsHistory,
  selectPartner,
  selectCurrentDeclaration,
  selectIsCoinched,
  selectPreferences,
} from '../redux/selectors/game';

import {name} from '../../../shared/utils/player';

import '../../scss/components/DeclarationForm.scss';

const DeclarationForm = ({
  players,
  currentPlayer,
  activePlayer,
  currentDeclaration,
  declarationsHistory,
  declare,
  finalDeclare,
  launchGame,
  distribute,
  isActivePlayer,
  partner,
  isCoinched,
  preferences,
}) => {

  const onlyFinalDeclaration = preferences.declarationMode === FINAL_DECLARATION;
  const canDeclare = onlyFinalDeclaration || isActivePlayer;

  const goalOptions = range(8, 16)
    .map(i => 10*i)
    .filter(i => !currentDeclaration || (i > currentDeclaration.goal))
    .map(i => ({name: i, value: i}))
    .concat({name: 'Capot', value: 250})
    .concat({name: 'Générale', value: 500})

  const [state, setState] = useState({goal: first(goalOptions).value});

  const previousDeclarations = declarationsHistory.filter((_d, i) => i !== declarationsHistory.length - 1)

  useEffect(() => {
    if (currentDeclaration) {
      // console.log(currentDeclaration, declarationsHistory)
      // If currentPlayer made a declaration and everybody else passed OR someone has surcoinched => launch the game
      if (((currentDeclaration.playerId === currentPlayer.id) && isActivePlayer) || (declarationsHistory.filter(d => d.type === declarationTypes.COINCHE).length === 2)) {
        launchGame();
        return;
      };
    };

    // If everybody passed => create a new game
    if (declarationsHistory.length === 4 && !declarationsHistory.filter(d => d.type !== declarationTypes.PASS).length) {
      distribute();
      return;
    };

  }, [currentDeclaration]);

  const handleChange = (event) => {
    const {name, value} = event.target;
    setState({
      ...state,
      [name]: parseInt(value) || value || null,
    })
  };

  const doPass = () => {
    declare({
      type: declarationTypes.PASS,
      playerIndex: currentPlayer.index,
    });
  };

  const doDeclare = () => {
    const declaration = {
      playerIndex: state.playerIndex || currentPlayer.index,
      type: declarationTypes.DECLARE,
      trumpType: state.trumpType,
      goal: state.goal,
      isCoinched: state.isCoinched,
    }
    onlyFinalDeclaration ? finalDeclare(declaration) : declare(declaration)
  };

  const doCoinche = () => {
    declare(currentPlayer.index, {
      type: declarationTypes.COINCHE,
    })
  };

  let isCoincheVisible = false;

  if (currentDeclaration) {
    const lastBid = last(declarationsHistory);
    const isCoincheEnabled = (currentPlayer.id !== lastBid.playerId) && (partner.id !== lastBid.playerId) && (currentDeclaration.playerId === lastBid.playerId);
    const isOverCoincheEnabled = isCoinched.length && ((currentPlayer.id === currentDeclaration.playerId) || (partner.id === currentDeclaration.playerId));
    isCoincheVisible = !onlyFinalDeclaration && isCoincheEnabled || isOverCoincheEnabled;
  }

  const isDeclareDisabled = () => {
    return ['goal', 'trumpType'].concat(onlyFinalDeclaration ? ['playerIndex'] : []).some(v => !state[v]);
  }

  const title = () => {
    if (onlyFinalDeclaration) return 'Annonce finale';
    return <Declaration value={last(declarationsHistory)} />;
  }

  const subTitle = () => {
    if (onlyFinalDeclaration) return 'L\'un des joueurs saisit l\'annonce finale';
    if (isActivePlayer) return 'C\'est à votre tour d\'annoncer';
    return `A ${name(activePlayer)} de parler`
  }

  return (
    <div className={`declaration ${canDeclare ? '' : 'is-disabled'}`}>
      <div className="headers">
        {previousDeclarations.length ? <ul>
          {previousDeclarations.map((d, i) => <li key={i} ><Declaration value={d} /></li>)}
        </ul> : null}
        <h3 className="title is-3 is-spaced">
          {title()}
        </h3>
        <p className="subtitle is-4">
          {subTitle()}
        </p>
      </div>
      <div className="form">
        <div className="field has-addons has-addons-centered all-options">
          <p className="control">
            <span className="select">
              <select name="goal" onChange={handleChange}>
                {goalOptions.map(({name, value}) => <option key={value} value={value}>{name}</option>)}
              </select>
            </span>
          </p>
          <p className="control">
            <span className="select">
              <select name="trumpType" onChange={handleChange}>
                <option value={''} defaultValue={true}>Quelle couleur ?</option>
                {Object.entries(trumpNames).map(([k, v]) => <option key={k} value={k} >{v}</option>)}
              </select>
            </span>
          </p>
          <p className="control">
            <span className="select">
              <select name="playerIndex" onChange={handleChange}>
                <option value={''} defaultValue={true}>Par ?</option>
                {players.map(p => <option key={p.index} value={p.index} >{name(p)}</option>)}
              </select>
            </span>
          </p>
          <p className="control">
            <span className="select">
              <select name="isCoinched" onChange={handleChange}>
                <option value={''} defaultValue={true}>Coinché ?</option>
                <option value={declarationTypes.COINCHE} >C'est coinché !</option>
                <option value={declarationTypes.SURCOINCHE}>Surcoinché !!</option>
              </select>
            </span>
          </p>
          <p className="control">
            <button className="button is-primary" disabled={isDeclareDisabled()} onClick={e => doDeclare()}>
              {onlyFinalDeclaration ? 'Saisir' : 'Annoncer'}
            </button>
          </p>
        </div>
        <div className="field">
          { onlyFinalDeclaration ?
            <p>Tout le monde passe ? <button className="button is-text" onClick={e => (confirm("Etes-vous sûr⸱e de vouloir abandonner la partie en cours ?") && distribute())}>Redistribuer</button></p> :
            <button className="button is-primary" onClick={e => doPass()}>Passer</button>
          }
        </div>
      </div>
      {isCoincheVisible ? (
        <div className="field">
          <button className={'button is-primary'} onClick={e => doCoinche()}>{`${!isCoinched.length ? 'Coincher' : 'Surcoincher'}`}</button>
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
  currentPlayer: selectCurrentPlayer,
  activePlayer: selectActivePlayer,
  currentDeclaration: selectCurrentDeclaration,
  declarationsHistory: selectDeclarationsHistory,
  isActivePlayer: selectIsActivePlayer,
  partner: selectPartner,
  isCoinched: selectIsCoinched,
  preferences: selectPreferences,
});

const mapDispatchToProps = {
  declare,
  launchGame,
  distribute,
  finalDeclare,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeclarationForm);

