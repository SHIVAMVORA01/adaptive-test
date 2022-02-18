import React, { useState, useEffect } from "react";

export default function Alert({
  msg,
  isAlertMsgLoaded,
  setIsAlertMsgLoaded,
  type,
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (msg) {
      setShow(true);
      setInterval(() => {
        setShow(false);
      }, 4000);
    }
    setIsAlertMsgLoaded(false);
  }, [isAlertMsgLoaded]);
  return <>{show && <div className={`alert alert-${type}`}>{msg}</div>}</>;
}
