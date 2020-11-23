import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import { LocalStateContext } from '../pages/GamePage';
import { playCard, getCardBack } from '../redux/actions';
import { selectOnTable, selectIsActivePlayer } from '../redux/selectors';
import PropTypes from 'prop-types';

import '../../scss/components/card.scss';

// Can't use import, require needed :(
const images = require('../../images/cards/*.svg');

const Card = ({value, onTable, isActivePlayer, isHidden, isSelectable, playCard, getCardBack}) => {
  const {tableId} = useContext(LocalStateContext);
  const image = isHidden ? images['BLUE_BACK'] : images[value];

  const handleClick = (e) => {
    if (!isSelectable) return;
    const cardValue = value;
    if (!isActivePlayer) {
      if (!window.confirm("Ce n'est pas votre tour !")) 
      return;
    };
    (onTable.find(({value}) => value === cardValue)) ? getCardBack(tableId, value) : playCard(tableId, value);
  }

  return (
    <div className="card-wrapper">
      {image ? <img onClick={e => handleClick(event)} className={`playing-card ${isSelectable ? 'is-selectable' : ''}`} src={image} /> : <p>Carte inconnue</p>}
    </div>
  )
}

Card.propTypes = {
  isHidden: PropTypes.bool,
  isSelectable: PropTypes.bool,
  value: PropTypes.string.isRequired,
  playCard: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  onTable: selectOnTable(state),
  isActivePlayer: selectIsActivePlayer(state),
})

const mapDispatchToProps = (dispatch) => ({
  playCard: (tableId, value) => dispatch(playCard(tableId, value)),
  getCardBack: (tableId, value) => dispatch(getCardBack(tableId, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Card);