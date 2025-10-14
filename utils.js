// Converte "15:05" em Date (hoje)
export function parseTimeString(str) {
  const [h, m] = str.split(":").map(Number);
  const now = new Date();
  now.setHours(h, m, 0, 0);
  return now;
}

// Retorna multiplicador baseado na hora
export function getSpeedMultiplier(hour, map) {
  const isDay = hour >= 6 && hour < 18;

  switch (map.toLowerCase()) {
    case "chernarus":
      return isDay ? 4.2 : 16.8;

    case "livonia":
      return isDay ? 5.4 : 5.4 * 2.17;

    default:
      return isDay ? 4.2 : 16.8; // padrão (Chernarus)
  }
}


// Avança o tempo simulado com base no delta real
/* function advanceSimulatedTime(baseTime, deltaMs, map) {
  const elapsedReal = deltaMs / 1000 / 60 / 60; // horas reais
  const hour = baseTime.getHours();
  const speed = getSpeedMultiplier(hour, map);
  const advanced = new Date(baseTime.getTime() + deltaMs * speed);
  return advanced;
} */


// Formata "Xh Ymin"
export function formatRemaining(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}min`;
}
