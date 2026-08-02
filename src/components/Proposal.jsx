import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Rose from "./Rose.jsx";

export default function Proposal() {
  const [accepted, setAccepted] = useState(false);
  const [noBtnStyle, setNoBtnStyle] = useState({});

  useEffect(() => {
    if (!accepted) return;

    const duration = 5 * 1000; // 5 seconds
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff0000", "#ff69b4"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff0000", "#ff69b4"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [accepted]);

  const dodgeNoButton = () => {
    const x = Math.random() * 220 - 110;
    const y = Math.random() * 100 - 50;
    setNoBtnStyle({ transform: `translate(${x}px, ${y}px)` });
  };

  return (
    <div className="proposal-screen">
      {!accepted ? (
        <>
          <h1 className="proposal-text">¿Quieres ser mi novia MaJo?</h1>
          <div className="proposal-buttons">
            <button
              type="button"
              className="btn-yes"
              onClick={() => setAccepted(true)}
            >
              Sí 💕
            </button>
            <button
              type="button"
              className="btn-no"
              style={noBtnStyle}
              onMouseEnter={dodgeNoButton}
              onClick={dodgeNoButton}
            >
              No
            </button>
          </div>
        </>
      ) : (
        <Rose tagline="¡Sabia que dirias que sí MJ, Love yaaa!" />
      )}
    </div>
  );
}
