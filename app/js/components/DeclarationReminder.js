import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectPlayers,
	selectDeclarationsHistory,
	selectCurrentDeclaration,
	selectIsCoinched,
} from '../redux/selectors/game';
import trumpTypes from '../../../shared/constants/trumpTypes';
import cardSymbols from '../../images/symbols';

const DeclarationReminder = ({ players, currentDeclaration, declarationsHistory, isCoinched }) => {

	if (!currentDeclaration) return null;
	const playerName = players[parseInt(currentDeclaration.playerIndex)].name;

	const TrumpType = () => {
		if (currentDeclaration.trumpType === trumpTypes.ALL_TRUMP) {
			return "Tout Atout"
		} else if (currentDeclaration.trumpType === trumpTypes.NO_TRUMP) {
			return "Sans Atout"
		} else {
			return (
					<img className="icon is-small" style={{marginLeft: '0.25rem'}} src={cardSymbols[currentDeclaration.trumpType]}/>
			)
		}
	}

	return (
		<p>{playerName} : {currentDeclaration.goal}<TrumpType /> {`${(isCoinched.length >= 2) ? 'Surcoinchée' : ((isCoinched.length === 1) ? 'Coinchée' : '')}`}</p>
	);
};


const mapStateToProps = createStructuredSelector({
	players: selectPlayers,
	currentDeclaration: selectCurrentDeclaration,
	declarationsHistory: selectDeclarationsHistory,
	isCoinched: selectIsCoinched,
})


export default connect(mapStateToProps)(DeclarationReminder);
