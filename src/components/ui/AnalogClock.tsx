import  { useEffect, useState } from 'react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const hourDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  const minDeg = time.getMinutes() * 6;
  const secDeg = time.getSeconds() * 6;

  return (
    <div className="clock">
      <div className="hour_hand" style={{ transform: `rotateZ(${hourDeg}deg)` }} />
      <div className="min_hand" style={{ transform: `rotateZ(${minDeg}deg)` }} />
      <div className="sec_hand" style={{ transform: `rotateZ(${secDeg}deg)` }} />

      <span className="twelve">12</span>
      <span className="one">1</span>
      <span className="two">2</span>
      <span className="three">3</span>
      <span className="four">4</span>
      <span className="five">5</span>
      <span className="six">6</span>
      <span className="seven">7</span>
      <span className="eight">8</span>
      <span className="nine">9</span>
      <span className="ten">10</span>
      <span className="eleven">11</span>
    </div>
  );
};

export default AnalogClock;
