import React from 'react';
import { connect } from 'react-redux';
import { selectTeams } from '../redux/selectors';

const ScoreReminder = ({ teams }) => {
	return (
		<div className="table-container">
			<table className="table is-fullwidth">
			<tr>
				{
					teams.map( team => {
						return (!team) ?
							null :
							<td key={team.name}>
								<table className="table is-fullwidth">
									<thead><tr><td>{team.name}</td></tr></thead>
									<tbody>
										<tr>{(team.totalScore || 0)}</tr>
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

const mapStateToProps = (state) => ({
	teams: selectTeams(state),
});

export default connect(mapStateToProps)(ScoreReminder);