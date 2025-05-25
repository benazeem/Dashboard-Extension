import  { useEffect, useState } from 'react';

const AnalogClock2 = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const hourDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  const minDeg = time.getMinutes() * 6;
  const secDeg = time.getSeconds() * 6;

  return (
    <div className="clock2" >
      <div className="hour_hand2" style={{ transform: `rotateZ(${hourDeg}deg)` }} />
      <div className="min_hand2" style={{ transform: `rotateZ(${minDeg}deg)` }} />
      <div className="sec_hand2" style={{ transform: `rotateZ(${secDeg}deg)` }} />

      <span className="twelve2">12</span>
      <span className="one2">1</span>
      <span className="two2">2</span>
      <span className="three2">3</span>
      <span className="four2">4</span>
      <span className="five2">5</span>
      <span className="six2">6</span>
      <span className="seven2">7</span>
      <span className="eight2">8</span>
      <span className="nine2">9</span>
      <span className="ten2">10</span>
      <span className="eleven2">11</span>
    </div>
  );
};

export default AnalogClock2;
