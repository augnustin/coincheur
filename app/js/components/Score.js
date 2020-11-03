import React from 'react';
import {connect} from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectTricksByTeam,
  selectPreferences,
} from '../redux/selectors/game';
import {distribute} from '../redux/actions/socketActions';
import {NO_DECLARATION} from '../../../shared/constants/options';

import ScoreBoard from './ScoreBoard';
import Card from './Card';

const TeamHand = ({tricks}) => {
  return (
    <div className="hand with-tricks">
      {
        tricks.length
        ? tricks.map(({cards}, i) => <div key={i} className="trick">{cards.map(c => <Card key={c} value={c} />)}</div>)
        : <p>Aucun pli :(</p>
      }
    </div>
  )
}

const Score = ({tricks, distribute, preferences}) => {
  const [us, others] = tricks;
  return (
    <div className="commands has-text-centered">
      {preferences.declarationMode !== NO_DECLARATION && <ScoreBoard />}
      <div className="row">
        <h4 className="title is-4">Nous</h4>
        <TeamHand tricks={us} />
      </div>
      <div className="row">
        <h4 className="title is-4">Eux</h4>
        <TeamHand tricks={others} />
      </div>
      <button className="button is-primary is-large" onClick={() => distribute()}>Redistribuer</button>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  tricks: selectTricksByTeam,
  preferences: selectPreferences,
})

const mapDispatchToProps = {
  distribute,
}

export default connect(mapStateToProps, mapDispatchToProps)(Score);