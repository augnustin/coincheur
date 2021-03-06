import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getScore } from '../redux/actions/socketActions';
import {
	selectPlayers,
	selectCurrentPlayer,
	selectTeams,
	selectCurrentDeclaration,
} from '../redux/selectors/game';

import Declaration from './Declaration';

const ScoreBoard = ({ getScore, players, currentPlayer, currentDeclaration, teams}) => {

	useEffect(() => {
	  getScore()
	}, []);

	return (!teams.filter(team => team.currentGame).length) ? null :
		<div className="table-container">
			<table className="table is-fullwidth score-board">
				<thead>
					<tr>
						<td>&nbsp;</td>
						{teams.map( (team, i) => <td key={i}>{team.name}</td>)}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Annonce</td>
						{teams.map( (team, i) => (team.currentGame.isBidderTeam) ? <td><Declaration value={currentDeclaration} /></td> : <td>&nbsp;</td> )}
					</tr>
					<tr>
						<td>Coinche</td>
						{teams.map( (team, i) => (team.currentGame.isBidderTeam) ? <td colspan="2">{team.currentGame.isCoinched}</td> : null )}
					</tr>
					<tr>
						<td>Points</td>
						{teams.map( (team, i) => <td key={i}>{team.currentGame.gameScore + ((team.currentGame.hasLastTen) ? 10 : 0)}</td>)}
					</tr>
					<tr>
						<td>Belote</td>
						{teams.map( (team, i) => <td key={i}>{(team.currentGame.hasBelote) ? 20 : 0}</td>)}
					</tr>
					<tr>
						<td>Total</td>
						{teams.map( (team, i) => <td key={i}>{team.currentGame.gameTotal}</td>)}
					</tr>
					<tr>
						<td>Total de la partie</td>
						{teams.map( (team, i) => <td key={i}>{(team.totalScore || 0) + team.currentGame.gameTotal}</td>)}
					</tr>
				</tbody>
			</table>
		</div>
};

const mapStateToProps = createStructuredSelector({
	players: selectPlayers,
	currentPlayer: selectCurrentPlayer,
	currentDeclaration: selectCurrentDeclaration,
	teams: selectTeams,
});

const mapDispatchToProps = {
	getScore,
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreBoard);
