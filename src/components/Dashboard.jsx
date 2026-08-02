export default function Dashboard({
  onTrigger,
  devicesOnline = 2,
  temperature = 25.5,
  proximityStatus = "ESPERANDO...",
  proximityReading = 1024,
}) {
  return (
    <div className="dashboard">
      <header className="header">
        <h1>[ SISTEMA DE MONITOREO ]</h1>
        <p>Estado de red: Online | Dispositivos: {devicesOnline}</p>
      </header>

      <div className="sensor-grid">
        <div className="sensor-card">
          <h2>Sensor Temperatura</h2>
          <div className="data">Temp: {temperature}°C</div>
        </div>
        <div className="sensor-card">
          <h2>Sensor Proximidad</h2>
          <div className="data highlight">Estado: {proximityStatus}</div>
          <div className="data">Lectura: {proximityReading}</div>
        </div>
      </div>

      {/* Easter egg */}
      <div
        className="trigger-pixel"
        onClick={onTrigger}
        title="Trigger Glitch"
      ></div>
    </div>
  );
}
