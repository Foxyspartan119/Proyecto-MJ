import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Terminal({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [userInput, setUserInput] = useState("");
  const endOfTerminalRef = useRef(null);

  const initialStory = [
    "> Iniciando secuencia de acceso... [VERIFICANDO DATOS]",
    "> Registro 1: Interpolitecnicos 2025. Sujeto identificado...Maria Jose Torres",
    "> Registro 2: Universiada Nacional 2026... Reencuentro detectado.",
    "> Registro 3: Conexión sentimental... Intercambio de datos y sentimientos confirmado.",
    "> Distancia Física calculada: CDMX -> Zacatecas.",
    "> Evaluando estado actual de la conexión...",
    "> ERROR DE SISTEMA: Se requiere input manual para continuar.",
    "> Por favor, registra tu recuerdo favorito de cuando convivimos en la competencia:",
  ];

  const fallbackResponse = [
    "> IA_SYS: Recuerdo archivado con éxito. Compatibilidad: 1000%. La distancia es solo un número, el amor supera cualquier obstáculo. Ejecutando protocolo final...",
    "> IA_SYS: Datos procesados. Nivel de conexión: legendario. Ningún km puede contra esto. Ejecutando protocolo final...",
    "> IA_SYS: Recuerdo validado. Compatibilidad máxima alcanzada. La distancia no es rival para nuestro vínculo. Ejecutando protocolo final...",
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < initialStory.length) {
        setLines((prev) => [...prev, initialStory[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsWaitingInput(true);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLines((prev) => [...prev, `> Usuario: ${userInput}`]);
    setIsWaitingInput(false);
    setUserInput("");
    setLines((prev) => [...prev, "> Procesando tu recuerdo..."]);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Actúa como una terminal de computadora romántica y hacker.
      Una chica acaba de ingresar su recuerdo favorito sobre cómo nos conocimos en la competencia de Universiada:
      "${userInput}" Responde brevemente (máximo 3 líneas) validando el recuerdo, diciendo que la compatibilidad es
      del 1000% y que la distancia física no importa, y que el amor es más fuerte que cualquier obstáculo. Terminando con: "Ejecutando protocolo final..."`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setLines((prev) => [...prev, `> IA_SYS: ${text}`]);

      setTimeout(() => {
        onComplete();
      }, 5000);
    } catch (error) {
      console.error("Error al generar respuesta:", error);
      const fallback =
        fallbackResponse[Math.floor(Math.random() * fallbackResponse.length)];
      setLines((prev) => [...prev, fallback]);
      setTimeout(() => {
        onComplete();
      }, 5000);
    }
  };

  return (
    <div className="terminal-screen">
      <div className="terminal-content">
        {lines.map((line, index) => (
          <p key={index} className="log-line highlight">
            {line}
          </p>
        ))}

        {isWaitingInput && (
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <span className="terminal-prompt">{"> "}</span>
            <input
              type="text"
              autoFocus
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="terminal-input"
            />
          </form>
        )}
        <div ref={endOfTerminalRef} />
      </div>
    </div>
  );
}
