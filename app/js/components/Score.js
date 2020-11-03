import React, {useState} from 'react';
import {connect} from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectTricksByTeam,
  selectPreferences,
} from '../redux/selectors/game';
import {redistribute} from '../redux/actions/socketActions';
import {NO_DECLARATION} from '../../../shared/constants/options';
import {pluralize} from '../../../shared/utils/string';

import ScoreBoard from './ScoreBoard';
import Card from './Card';
import '../../scss/components/Score.scss';

const TeamHand = ({tricks}) => {
  if (!tricks.length) return <p>Aucun pli :(</p>
  return (
    <div className="hand with-tricks">
      { tricks.map(({cards}, i) => <div key={i} className="trick">{cards.map(c => <Card key={c} value={c} />)}</div>)}
    </div>
  )
}

const Score = ({tricks, redistribute, preferences}) => {
  const [scoreInputVisible, setScoreInputVisible] = useState(false);
  const [usScore, setUsScore] = useState(0);
  const [othersScore, setOthersScore] = useState(0);
  const countScore = usScore || othersScore;
  const [us, others] = tricks;
  return (
    <div className="commands has-text-centered">
      {preferences.declarationMode !== NO_DECLARATION && <ScoreBoard />}
      <div className="row">
        <h4 className="title is-4">Nous : {pluralize(us.length, 'pli')}</h4>
        <TeamHand tricks={us} />
      </div>
      <div className="row">
        <h4 className="title is-4">Eux : {pluralize(others.length, 'pli')}</h4>
        <TeamHand tricks={others} />
      </div>
      <div className="row">
        { scoreInputVisible ? (
          <div className="score-input-container">
              <div className="field has-addons">
                <p className="control">
                  <a className="button is-static">
                    Nous
                  </a>
                </p>
                <p className="control is-expanded">
                  <input className="input" type="number" min="0" step="10" value={usScore} onChange={e => setUsScore(parseInt(e.target.value))} />
                </p>
            </div>
              <div className="field has-addons">
                <p className="control">
                  <a className="button is-static">
                    Eux
                  </a>
                </p>
                <p className="control is-expanded">
                  <input className="input" type="number" min="0" step="10" value={othersScore} onChange={e => setOthersScore(parseInt(e.target.value))} />
                </p>
            </div>
          </div>
        ) : (
          <button className="button is-text" onClick={() => setScoreInputVisible(true)}>Compter les points</button>
        )}
      </div>
      <div className="row">
        <button className="button is-primary is-large" onClick={() => (countScore ? redistribute([usScore, othersScore]) : redistribute())}>{
          countScore ? 'Compter et redistribuer' : 'Redistribuer'
        }</button>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  tricks: selectTricksByTeam,
  preferences: selectPreferences,
})

const mapDispatchToProps = {
  redistribute,
}

export default connect(mapStateToProps, mapDispatchToProps)(Score);