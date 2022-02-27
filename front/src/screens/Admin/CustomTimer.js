import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

function CustomTimer({
  time,
  start,
  reset = false,
  msg,
  onlyS = false,
  nextpage = "",
  setMd = 0,
  isLogin = false,
}) {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const increment = useRef(null);
  const navigate = useNavigate();

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(true);
    increment.current = setInterval(() => {
      setTimer(function (timer) {
        if (timer > 1) {
          return timer - 1;
        } else {
          clearInterval(increment.current);
          if (setMd !== 0) setMd(true);
          if (!isLogin) {
            navigate(`/${nextpage}`);
          } else {
            handleReset();
          }
        }
      });
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(increment.current);
    setIsPaused(false);
  };

  const handleResume = () => {
    setIsPaused(true);
    increment.current = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
  };

  const handleReset = () => {
    clearInterval(increment.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  const formatTime = () => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);
    let seconds = Number(timer);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hr " : " hrs ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    if (!onlyS) {
      return `${getHours} : ${getMinutes} : ${getSeconds}`;
    } else if (isLogin) {
      if (d > 0) {
        return dDisplay + hDisplay;
      } else if (d === 0 && h !== 0) {
        return hDisplay + mDisplay;
      } else if (d === 0 && h === 0 && m !== 0) {
        return mDisplay + sDisplay;
      } else if (d === 0 && h === 0 && m === 0 && s !== 0) {
        return "0 min " + sDisplay;
      } else if (d === 0 && h === 0 && m === 0 && s === 0) {
        return "0 min 0 sec";
      }
    } else {
      return `${getSeconds}`;
    }
  };
  useEffect(() => {
    setTimer(time);
    if (start) {
      handleStart();
    }
    if (reset) {
      handleReset();
    }
    return () => {
      setTimer();
    };
  }, [start, reset]);

  return (
    <>
      {msg} {!isLogin && <b>{formatTime()}</b>} {isLogin && formatTime()}
    </>
  );
}
export default CustomTimer;
