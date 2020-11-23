import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getScore } from '../redux/actions';
import { LocalStateContext } from '../pages/GamePage.js';
import {selectScore,
				selectPlayers,
				selectLastMasterIndex,
				selectCurrentPlayer,
				selectCurrentDeclaration,
				selectTeams,
				selectPartnerId } from '../redux/selectors';

const ScoreBoard = ({ getScore, score, players, currentPlayer, lastMasterIndex, currentDeclaration, teams, partnerId }) => {

	const {tableId} = useContext(LocalStateContext);

	useEffect(() => {
	  getScore(tableId)
	}, []);

	return (
		<div className="table-container">
			<table className="table is-fullwidth">
			<tr>
				<td>
					<table className="table is-fullwidth">
						<thead><tr><td>&nbsp;</td></tr></thead>
						<tbody>
							<tr>Points</tr>
							<tr>Dix de der</tr>
							<tr>Belote</tr>
							<tr>Total</tr>
							<tr>Total de la partie</tr>
						</tbody>
					</table>
				</td>
				{
					teams.map( (team) => {
						return (!team.currentGame) ?
							null :
							<td key={team.name}>
								<table className="table is-fullwidth">
									<thead><tr><td>{team.name}</td></tr></thead>
									<tbody>
										<tr>{team.currentGame.gameScore}</tr>
										<tr>{(team.currentGame.hasLastTen) ? 10 : 0}</tr>
										<tr>{(team.currentGame.hasBelote) ? 20 : 0}</tr>
										<tr>{team.currentGame.gameTotal}</tr>
										<tr>{(team.totalScore || 0) + team.currentGame.gameTotal}</tr>
									</tbody>
								</table>
							</td>
					})
				}
			</tr>
			</table>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getScore: (tableId) => dispatch(getScore(tableId)),
});

const mapStateToProps = createStructuredSelector({
	score: selectScore,
	players: selectPlayers,
	lastMasterIndex: selectLastMasterIndex,
	currentPlayer: selectCurrentPlayer,
	currentDeclaration: selectCurrentDeclaration,
	teams: selectTeams,
	partnerId: selectPartnerId
});

export default connect(mapStateToProps, mapDispatchToProps)(ScoreBoard);
