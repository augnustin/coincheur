import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	selectScore,
} from '../redux/selectors/game';
import {last} from '../../../shared/utils/array';

import '../../scss/components/ScoreReminder.scss';

const ScoreReminder = (props) => {
	const score = props.onlyLast ? [last(props.score)] : props.score;

	const sumScore = score => score.reduce(([us_acc, others_acc], [us, others]) => {
		return [us_acc + us, others_acc + others];
	}, [0, 0]);

	const displayScore = (_, index, scores) => {
		const [us, others] = sumScore(scores.slice(0, index+1));
		if (props.onlyLast && (index+1 < scores.length)) return;
		return (
			<tr key={index}>
				<td>{us}</td>
				<td>{others}</td>
			</tr>
		)
	}

	return (
		<table className="table score-table is-fullwidth">
			<thead>
				<tr>
					<td>NOUS</td>
					<td>EUX</td>
				</tr>
			</thead>
			<tbody>
				{props.score.map(displayScore)}
			</tbody>
		</table>
	);
};

const mapStateToProps = createStructuredSelector({
	score: selectScore,
});

export default connect(mapStateToProps)(ScoreReminder);