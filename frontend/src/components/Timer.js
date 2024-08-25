import React, { useEffect, useState } from 'react';

function Timer({ startTime, duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = Date.now();
      const elapsedTime = Math.floor((now - startTime) / 1000);
      const newTimeLeft = duration - elapsedTime;
      setTimeLeft(newTimeLeft > 0 ? newTimeLeft : 0);
      if (newTimeLeft <= 0) {
        onTimeUp();
      }
    };

    updateRemainingTime();
    const timerId = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(timerId);
  }, [startTime, duration, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="timer">
      <p className="text-lg font-semibold">Time left: {formatTime(timeLeft)}</p>
    </div>
  );
}

export default Timer;
