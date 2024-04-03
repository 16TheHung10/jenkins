import React, { useEffect, useState } from "react";

const CountDown = ({ time = 60, action }) => {
  const [timer, setTimer] = useState(time);
  useEffect(() => {
    let interval;
    if (timer >= 1) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            action();
            localStorage.removeItem("timer");
          }
          return prev - 1;
        });
      }, [1000]);
    } else {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    }
    return () => {
      clearInterval(interval);
      localStorage.setItem("timer", timer);
    };
  });
  return (
    <h1 style={{ textAlign: "center", color: "var(--primary-color)" }}>
      {timer}s
    </h1>
  );
};

export default CountDown;
