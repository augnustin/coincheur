import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { declare, launchGame, newGame } from '../redux/actions';
import { createStructuredSelector } from 'reselect';
import { LocalStateContext } from '../pages/GamePage';
import DeclarationHistory from './DeclarationHistory';
import trumpTypes from '../../../shared/constants/trumpTypes';
import declarationTypes from '../../../shared/constants/declarationTypes';
import { last } from '../../../shared/utils/array';
import cardSymbols from '../../images/symbols';
import {selectPlayers,
        selectCurrentPlayer,
        selectCurrentDeclaration,
        selectIsActivePlayer,
        selectActivePlayer,
        selectDeclarationsHistory,
        selectPartnerId } from '../redux/selectors';

import '../../scss/components/declaration.scss';

const INITIAL_STATE = {
  goal: 80,
  trumpType: null,
};

const Declaration = ({ players, currentPlayer, activePlayer, currentDeclaration, declarationsHistory, declare, launchGame, newGame, isActivePlayer, partnerId }) => {

  const {tableId} = useContext(LocalStateContext);
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    if (currentDeclaration) {

      // If currentPlayer made a declaration and everybody else passed OR someone has surcoinched
      //  => launch the game
      if (((currentDeclaration.playerId === currentPlayer.id) && isActivePlayer) || (currentDeclaration.isCoinched === 4)) {
        launchGame(tableId);
        return;
      };

      // If everybody passed => create a new game
      if ((declarationsHistory.length === 4) && (!Object.entries(currentDeclaration.content).length)) {
        newGame(tableId);
        return;
      };

      if (Object.entries(currentDeclaration.content).length) {
        const content = currentDeclaration.content;
        const prevGoal = parseInt(content.goal);
        const newGoal = (prevGoal < 160) ? prevGoal + 10 : prevGoal;
        setState({
          ...state,
          goal: newGoal,
        });
      }
    }
  }, [currentDeclaration]);

  const handleChange = (event) => {
    const target = event.target;
    setState({
      ...state,
      [target.name]: target.value,
    })
  };

  const toggleCapot = (event) => {
    if (state.goal === 250) {
      let prevGoal = 80;

      if (currentDeclaration) {
        prevGoal = parseInt(currentDeclaration.content.goal) + 10
      };
      setState({
        ...state,
        goal: prevGoal,
      });
      return;
    }

    setState({
      ...state,
      goal: parseInt(250),
    })
  };

  const handleClick = (event) => {
    const type = event.target.name;
    let content = {}
    if (type !== trumpTypes.PASS) {
      content = {
        trumpType: state.trumpType,
        goal: state.goal,
      }
    }
    declare(tableId, currentPlayer.id, {type, content});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const content = {
      trumpType: state.trumpType,
      goal: state.goal,
    };
    declare(tableId, currentPlayer.id, {type: declarationTypes.DECLARE, content})
  };

  let isCoincheVisible = false;
  let isDeclareDisabled = false;
  let isCoinched = false;

  if (currentDeclaration) {
    const lastBid = last(declarationsHistory);
    isCoinched = (currentDeclaration.isCoinched);
    isCoincheVisible = (currentPlayer.id !== lastBid.playerId) && (partnerId !== lastBid.playerId) && (currentDeclaration.playerId === lastBid.playerId);
    isDeclareDisabled = (currentDeclaration.content.goal === 250) || isCoinched;
  }


  return (
    <div className={`declaration ${isActivePlayer ? '' : 'is-disabled'}`}>
      <p className="title is-4">
        {isActivePlayer ? 'C\'est à votre tour d\'annoncer' : `En attente de l'annonce de ${activePlayer.name}`}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field is-grouped level">
          <label className="control number">Annonce</label>
          <div className="control level-item">
            <input
              className="input"
              type="number"
              disabled={state.goal === 250}
              name="goal"
              min={state.goal}
              step="10"
              max="160"
              value={state.goal}
              onChange={handleChange}
            />
          </div>
          <label className="control checkbox level-item" onChange={toggleCapot}>
            <input
              className="form-check-input"
              type="checkbox"
              name="goal"
              onChange={toggleCapot}
              checked={state.goal === 250}
            />
            Capot
          </label>
        </div>
        <div className="field is-grouped level">
          <label className="control level-item" onChange={handleChange}>
            <input
              className="form-check-input"
              type="radio"
              name="trumpType"
              value={trumpTypes.S}
              checked={state.trumpType === trumpTypes.S}
              onChange={handleChange}
              required
            />
            <span className="icon is-medium is-center"><img src={cardSymbols['S']} alt="SpadesSymbol"/></span>
          </label>
          <label className="control level-item" onChange={handleChange}>
            <input
              className="form-check-input"
              type="radio"
              name="trumpType"
              value={trumpTypes.H}
              onChange={handleChange}
              checked={state.trumpType === trumpTypes.H}
            />
            <span className="icon is-medium is-center"><img src={cardSymbols['H']} alt="HeartSymbol"/></span>
          </label>
          <label className="control level-item" onChange={handleChange}>
            <input
              className="form-check-input"
              type="radio"
              name="trumpType"
              value={trumpTypes.D}
              checked={state.trumpType === trumpTypes.D}
              onChange={handleChange}
            />
            <span className="icon is-medium is-center"><img src={cardSymbols['D']} alt="DiamondSymbol" /></span>
          </label>
          <label className="control radio level-item" onChange={handleChange}>
            <input
              className="form-check-input"
              type="radio"
              name="trumpType"
              value={trumpTypes.C}
              checked={state.trumpType === trumpTypes.C}
              onChange={e => handleChange(e)}
            />
            <span className="icon is-medium is-center"><img src={cardSymbols['C']} alt="ClubsSymbol"/></span>
          </label>
          <label className="control level-item" onChange={handleChange}>
            <input
              className="form-check-input"
              type="radio"
              name="trumpType"
              value={trumpTypes.ALL_TRUMP}
              checked={state.trumpType === trumpTypes.ALL_TRUMP}
              onChange={handleChange}
            />
            Tout atout
          </label>
          <label className="control level-item" onChange={handleChange}>
            <input
              className="form-check-input"
              type="radio"
              name="trumpType"
              value={trumpTypes.NO_TRUMP}
              checked={state.trumpType === trumpTypes.NO_TRUMP}
              onChange={handleChange}
            />
            Sans atouts
          </label>
        </div>
        <div className="field is-grouped is-grouped-centered">
          <p className="control">
            <button className="button is-primary" type="submit" name={declarationTypes.DECLARE} disabled={isDeclareDisabled}>Annoncer</button>
          </p>
          <p className="control">
            <button className="button is-primary" type="submit" name={declarationTypes.PASS} onClick={handleClick}>Passer</button>
          </p>
        </div>
      </form>
      <div className="column is-narrow content">
        <DeclarationHistory />
        <div className="buttons is-centered">
          <button
            className={`button is-primary ${!isCoincheVisible ? 'is-hidden' : ''}`}
            name={declarationTypes.COINCHE}
            onClick={handleClick}
            >
            {`${!isCoinched ? 'Coincher' : 'Surcoincher'}`}
            </button>
        </div>
      </div>
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
  partnerId: selectPartnerId,
});

const mapDispatchToProps = (dispatch) => ({
  declare: (tableId, playerId, declaration) => dispatch(declare(tableId, playerId, declaration)),
  launchGame: (tableId) => dispatch(launchGame(tableId)),
  newGame: (tableId) => dispatch(newGame(tableId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Declaration);

