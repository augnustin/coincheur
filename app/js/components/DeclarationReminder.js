import React from 'react';
import { connect } from 'react-redux';
import { selectPlayers, selectCurrentDeclaration } from '../redux/selectors';
import trumpTypes from '../../../shared/constants/trumpTypes';
import cardSymbols from '../../images/symbols';

const DeclarationReminder = ({ players, currentDeclaration }) => {

	if (!currentDeclaration) return null;

	const playerName = players.find(p => p.id === currentDeclaration.playerId).name;

	const TrumpType = () => {
		if (currentDeclaration.trumpType === trumpTypes.ALL_TRUMP) {
			return "tout atout"
		} else if (currentDeclaration.trumpType === trumpTypes.NO_TRUMP) {
			return "sans-atouts"
		} else {
			return (
				<span className="icon is-small">
					<img src={cardSymbols[currentDeclaration.content.trumpType]}/>
				</span>
			)
		}
	}

	return (
		<div className="box">
			<h1 className="title is-4">{playerName}</h1>
			<div className="level">
				<div className="level-left">
					{currentDeclaration.content.goal}
				</div>
				<div className="level-right">
					<TrumpType />
				</div>
			</div>
		</div>
	);
};


const mapStateToProps = state => ({
	players: selectPlayers(state),
	currentDeclaration: selectCurrentDeclaration(state),
})


export default connect(mapStateToProps)(DeclarationReminder);
