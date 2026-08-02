import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Glitch from "./components/Glitch";
import Terminal from "./components/Terminal";
import Proposal from "./components/Proposal";

export default function App() {
  const [stage, setStage] = useState(0);

  return (
    <div className="app-container">
      {stage === 0 && <Dashboard onTrigger={() => setStage(1)} />}
      {stage === 1 && <Glitch onComplete={() => setStage(2)} />}
      {stage === 2 && <Terminal onComplete={() => setStage(3)} />}
      {stage === 3 && <Proposal />}
    </div>
  );
}
