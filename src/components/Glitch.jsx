import { useEffect, useMemo, useState } from "react";

const SYSTEM_MESSAGES = [
  "SYSTEM OVERRIDE",
  "SYSTEM ERROR",
  "SYSTEM FAILURE",
  "SYSTEM CRASH",
  "SYSTEM MALFUNCTION",
  "ACCESS GRANTED",
  "MY MODEM IS ON FIRE",
];

export default function Glitch({ onComplete }) {
  const finalMessage = useMemo(
    () => SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)],
    [],
  );
  const logId = useMemo(() => Math.floor(10000 + Math.random() * 90000), []);
  const [displayText, setDisplayText] = useState(SYSTEM_MESSAGES[0]);

  useEffect(() => {
    let ticks = 0;
    const maxTicks = 10; // Number of times to change the message before showing the final message
    const scrambleInterval = setInterval(() => {
      ticks++;
      if (ticks < maxTicks) {
        setDisplayText(finalMessage);
        clearInterval(scrambleInterval);
      } else {
        setDisplayText(
          SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)],
        );
      }
    }, 130); // Change the message every 200ms

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(scrambleInterval);
    };
  }, [onComplete, finalMessage]);

  return (
    <div className="glitch-screen">
      <div className="glitch-corner">
        <span className="glitch-corner-tag">// LOG_ID: {logId}</span>
        <h1 className="glitch-text" data-text={displayText}>
          {displayText}
        </h1>
      </div>
    </div>
  );
}
