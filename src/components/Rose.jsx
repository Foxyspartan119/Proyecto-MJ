import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Capas de pétalos, de adentro (capullo) hacia afuera. Basado 1:1 en el
// script.js original de "Rose Blooming from Code".
const PETAL_LAYERS = [
  { count: 4, w: 24, h: 46, curl: 78, delayBase: 0, tz: 2, cls: "petal-bud" },
  {
    count: 5,
    w: 34,
    h: 58,
    curl: 65,
    delayBase: 0.25,
    tz: 9,
    cls: "petal-core",
  },
  {
    count: 6,
    w: 46,
    h: 72,
    curl: 48,
    delayBase: 0.55,
    tz: 18,
    cls: "petal-inner",
  },
  {
    count: 7,
    w: 58,
    h: 88,
    curl: 22,
    delayBase: 0.9,
    tz: 30,
    cls: "petal-mid-inner",
  },
  {
    count: 8,
    w: 72,
    h: 104,
    curl: -5,
    delayBase: 1.3,
    tz: 44,
    cls: "petal-mid",
  },
  {
    count: 9,
    w: 86,
    h: 118,
    curl: -25,
    delayBase: 1.75,
    tz: 60,
    cls: "petal-outer",
  },
  {
    count: 10,
    w: 98,
    h: 130,
    curl: -48,
    delayBase: 2.25,
    tz: 76,
    cls: "petal-blush",
  },
];

const SEPALS_COUNT = 5;

/*const FALLING_PETAL_COLORS = [
  ["#9a001d", "#3d0008"],
  ["#850018", "#2b0005"],
  ["#ad0022", "#480008"],
  ["#bf0028", "#52000c"],
];*/
const FALLING_PETAL_COLORS = [
  ["#8c00c7", "#2a004f"],
  ["#7300ab", "#230042"],
  ["#a200e0", "#32005a"],
  ["#b800fa", "#3f006e"],
];

function buildSepals() {
  const step = 360 / SEPALS_COUNT;
  return Array.from({ length: SEPALS_COUNT }, (_, i) => ({
    id: `sepal-${i}`,
    angle: i * step + (Math.random() - 0.5) * 5,
    delay: 0.3 + i * 0.06,
    curl: 18 + Math.random() * 8,
  }));
}

function buildPetals() {
  const petals = [];
  PETAL_LAYERS.forEach((layer, li) => {
    const angleStep = 360 / layer.count;
    const layerOffset = li * 24 + (Math.random() - 0.5) * 8;
    for (let i = 0; i < layer.count; i++) {
      petals.push({
        id: `${layer.cls}-${i}`,
        cls: layer.cls,
        w: layer.w,
        h: layer.h,
        angle: layerOffset + i * angleStep + (Math.random() - 0.5) * 5,
        curl: layer.curl + (Math.random() - 0.5) * 6,
        scale: 0.94 + Math.random() * 0.12,
        delay: layer.delayBase + i * 0.05,
        tz: layer.tz,
        bloomDur: 2.1 + Math.random() * 0.4,
      });
    }
  });
  return petals;
}

// tagline: el mensaje que aparece bajo la rosa al final (agradecimiento).
export default function Rose({ tagline = "gracias por decir que sí" }) {
  const sepals = useMemo(buildSepals, []);
  const petals = useMemo(buildPetals, []);

  const [stage, setStage] = useState({
    grown: false,
    leafLeft: false,
    leafRight: false,
    blooming: false,
    rotating: false,
    endVisible: false,
  });

  const [fallingPetals, setFallingPetals] = useState([]);
  const nextPetalId = useRef(0);
  const intervalRef = useRef(null);

  const spawnFallingPetal = useCallback(() => {
    setFallingPetals((prev) => {
      if (prev.length > 10) return prev;

      const id = `fp-${nextPetalId.current++}`;
      const w = 10 + Math.random() * 12;
      const h = w * (1.25 + Math.random() * 0.15);
      const x = 20 + Math.random() * 60;
      const y = 3 + Math.random() * 10;
      const dur = 5.5 + Math.random() * 3.5;
      const fdelay = Math.random() * 0.6;
      const colors =
        FALLING_PETAL_COLORS[
          Math.floor(Math.random() * FALLING_PETAL_COLORS.length)
        ];
      const sign = () => (Math.random() > 0.5 ? 1 : -1);

      setTimeout(
        () => {
          setFallingPetals((cur) => cur.filter((p) => p.id !== id));
        },
        (dur + fdelay) * 1000 + 300,
      );

      return [
        ...prev,
        {
          id,
          w,
          h,
          x,
          y,
          dur,
          fdelay,
          c1: colors[0],
          c2: colors[1],
          s1: sign() * (15 + Math.random() * 25),
          s2: sign() * (10 + Math.random() * 20),
          s3: sign() * (20 + Math.random() * 30),
          s4: sign() * (10 + Math.random() * 15),
        },
      ];
    });
  }, []);

  // Misma línea de tiempo que el script.js original (growStem -> bloom ->
  // rotating -> falling petals -> end text), pero disparada automáticamente
  // al montar el componente, sin la tarjeta "Tap to Bloom".
  useEffect(() => {
    const timers = [];

    setStage((s) => ({ ...s, grown: true }));
    timers.push(
      setTimeout(() => setStage((s) => ({ ...s, leafLeft: true })), 800),
    );
    timers.push(
      setTimeout(() => setStage((s) => ({ ...s, leafRight: true })), 1100),
    );
    timers.push(
      setTimeout(() => setStage((s) => ({ ...s, blooming: true })), 2300),
    );
    timers.push(
      setTimeout(() => setStage((s) => ({ ...s, rotating: true })), 4900),
    );
    timers.push(
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          timers.push(setTimeout(spawnFallingPetal, i * 300));
        }
        intervalRef.current = setInterval(spawnFallingPetal, 2200);
      }, 5700),
    );
    timers.push(
      setTimeout(() => setStage((s) => ({ ...s, endVisible: true })), 6900),
    );

    return () => {
      timers.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [spawnFallingPetal]);

  return (
    <div className="rose-finale">
      <div className="vignette"></div>
      <div className="spotlight"></div>
      <div className={`ambient-light${stage.blooming ? " visible" : ""}`}></div>

      <div className="scene">
        <div className={`rose-wrapper${stage.rotating ? " rotating" : ""}`}>
          <div className="stem-group">
            <div className={`stem${stage.grown ? " grow" : ""}`}>
              <div className="stem-highlight"></div>
            </div>
            <div className="thorn thorn-1"></div>
            <div className="thorn thorn-2"></div>
            <div
              className={`leaf leaf-left${stage.leafLeft ? " visible" : ""}`}
            >
              <div className="leaf-vein"></div>
            </div>
            <div
              className={`leaf leaf-right${stage.leafRight ? " visible" : ""}`}
            >
              <div className="leaf-vein"></div>
            </div>
          </div>

          <div className={`calyx${stage.blooming ? " visible" : ""}`}>
            {sepals.map((s) => (
              <div
                key={s.id}
                className="sepal"
                style={{
                  "--sepal-angle": `${s.angle}deg`,
                  "--sepal-curl": `${s.curl}deg`,
                  "--sepal-delay": `${s.delay}s`,
                }}
              ></div>
            ))}
          </div>

          <div className={`rose-head${stage.blooming ? " blooming" : ""}`}>
            <div className="rose-glow"></div>
            <div className="rose-glow-inner"></div>
            {petals.map((p) => (
              <div
                key={p.id}
                className={`petal ${p.cls}`}
                style={{
                  width: `${p.w}px`,
                  height: `${p.h}px`,
                  "--angle": `${p.angle}deg`,
                  "--curl": `${p.curl}deg`,
                  "--scale": p.scale,
                  "--delay": `${p.delay}s`,
                  "--tz": `${p.tz}px`,
                  "--bloom-dur": `${p.bloomDur}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className={`end-text${stage.endVisible ? " visible" : ""}`}>
        <p className="tagline">{tagline}</p>
        <span className="rose-emoji">🌹</span>
      </div>

      <div className="falling-petals-container">
        {fallingPetals.map((p) => (
          <div
            key={p.id}
            className="falling-petal"
            style={{
              left: `${p.x}vw`,
              top: `${p.y}vh`,
              "--fp-w": `${p.w}px`,
              "--fp-h": `${p.h}px`,
              "--fp-c1": p.c1,
              "--fp-c2": p.c2,
              "--f-dur": `${p.dur}s`,
              "--f-delay": `${p.fdelay}s`,
              "--s1": `${p.s1}px`,
              "--s2": `${p.s2}px`,
              "--s3": `${p.s3}px`,
              "--s4": `${p.s4}px`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
