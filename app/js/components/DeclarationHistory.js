import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import trumpTypes from '../../../shared/constants/trumpTypes';
import { selectPlayers, selectCurrentPlayer, selectCurrentDeclaration, selectDeclarationsHistory } from '../redux/selectors';
import cardSymbols from '../../images/symbols';


const DeclarationHistory = ({declarations, currentDeclaration, players, playerId}) => {

  return (
      (declarations) ?
        <ul>
          {
            declarations.map(({playerId, content}, index) => {
              switch (content.trumpType) {
                case trumpTypes.S:
                case trumpTypes.H:
                case trumpTypes.D:
                case trumpTypes.C:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${(content.goal !== 250) ? content.goal : 'capot'}  `}
                      <span className="icon is-small">
                        <img src={cardSymbols[content.trumpType]}/>
                      </span>
                    </li>
                  );
                case trumpTypes.NO_TRUMP:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${content.goal} sans atouts`}
                    </li>
                  );
                case trumpTypes.ALL_TRUMP:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${content.goal} tout atout`}
                    </li>
                  );
                default:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a ${currentDeclaration.isCoinched ? 'coinché' : 'passé'}`}
                    </li>
                  );
                }
            })
          }
        </ul> :
        null
  );
};

const mapStateToProps = createStructuredSelector({
  players: selectPlayers,
  currentPlayer: selectCurrentPlayer,
  currentDeclaration: selectCurrentDeclaration,
  declarations: selectDeclarationsHistory,
});

export default connect(mapStateToProps)(DeclarationHistory);