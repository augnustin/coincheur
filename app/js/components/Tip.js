import React, {useState} from 'react';
import '../../scss/components/Tip.scss';

const LightBulbOn = require('../../images/light-bulb-on.svg');
const LightBulbOff = require('../../images/light-bulb-off.svg');

export default (props) => {
  const position = props.position || 'top';
  const [isActive, setIsActive] = useState(false);
  const toggleIsActive = () => setIsActive(!isActive);

  return (
    <div className={`tip ${isActive ? 'is-on' : ''}`} onClick={toggleIsActive}>
      <div className={`notification is-${position}`}><p><small>{props.children}</small></p></div>
      <img src={isActive ? LightBulbOn : LightBulbOff} />
    </div>
  )
}