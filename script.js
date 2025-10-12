/* 
#---------head--------------#
# Nome: DzTime
# Autor: Gabriel Quintanilha
#---------------------------#
# Versão: 2.0 (Single Script Edition)
# Web app que mostra horário do server e informações relevantes
*/

/* #---------Configuração---------# */
const SERVERS = [
  { id: "27886151", label: "0724 | SOUTH AMERICA - SP | 1st Person Only", map: "Chernarus" },
  { id: "29986609", label: "0742 | SOUTH AMERICA - SP | 1st Person Only", map: "Livonia" },
  // { id: "OUTROID", label: "Outro Servidor", map: "Desconhecido" },
];

const API_PROXY = "https://api.allorigins.win/raw?url=";
const OUTPUT = document.getElementById("output");

/* #---------Utilidades---------# */

// Converte "15:05" em Date (hoje)
function parseTimeString(str) {
  const [h, m] = str.split(":").map(Number);
  const now = new Date();
  now.setHours(h, m, 0, 0);
  return now;
}

// Retorna multiplicador baseado na hora
function getSpeedMultiplier(hour) {
  return (hour >= 6 && hour < 18) ? 4.2 : 16.8;
}

// Avança o tempo simulado com base no delta real
function advanceSimulatedTime(baseTime, deltaMs) {
  const elapsedReal = deltaMs / 1000 / 60 / 60; // horas reais
  const hour = baseTime.getHours();
  const speed = getSpeedMultiplier(hour);
  const advanced = new Date(baseTime.getTime() + deltaMs * speed);
  return advanced;
}

// Formata "Xh Ymin"
function formatRemaining(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}min`;
}

/* #---------Serviço da API---------# */

async function fetchServer(id) {
  const url = `${API_PROXY}${encodeURIComponent(`https://api.battlemetrics.com/servers/${id}`)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao acessar API");
  const json = await res.json();
  return json.data.attributes;
}

/* #---------Renderização---------# */

function renderAll(state) {
  OUTPUT.innerHTML = "";
  Object.values(state).forEach((s) => {
    const card = document.createElement("div");
    card.className = "server-card";
    card.innerHTML = `
      <h2>${s.label}</h2>
      <p><b>Mapa:</b> ${s.map}</p>
      <p><b>Status:</b> <span class="${s.status}">${s.status}</span></p>
      <p><b>Players:</b> ${s.players}</p>
      <p><b>Server Time:</b> ${s.displayTime}</p>
      <p><b>Restante até ${s.nextLabel}:</b> ${s.remaining}</p>
    `;
    OUTPUT.appendChild(card);
  });
}

/* #---------Execução principal---------# */

const serverState = {}; // id -> { baseTime, lastUpdate, status, players, etc }

async function refreshAll() {
  for (const s of SERVERS) {
    try {
      const attrs = await fetchServer(s.id);
      const baseTime = parseTimeString(attrs.details.time);
      serverState[s.id] = {
        label: s.label,
        map: s.map, 
        status: attrs.status,
        players: attrs.players,
        baseTime,
        lastUpdate: Date.now()
      };
    } catch (err) {
      serverState[s.id] = {
        label: s.label,
        map: s.map,
        status: "erro",
        players: "-",
        baseTime: new Date(),
        lastUpdate: Date.now()
      };
      console.error(`Erro ao buscar ${s.label}`, err);
    }
  }
}

function updateDisplay() {
  const updated = Object.entries(serverState).map(([id, s]) => {
    const now = Date.now();
    const delta = now - s.lastUpdate;
    const simTime = advanceSimulatedTime(s.baseTime, delta);
    const hours = simTime.getHours();
    const minutes = simTime.getMinutes().toString().padStart(2, "0");
    const displayTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
    
    // Próximo marco: 06h ou 18h
    const nextLabel = (hours >= 6 && hours < 18) ? "18h" : "06h";
    const targetHour = (hours >= 6 && hours < 18) ? 18 : 30; // 30 = 6h do dia seguinte
    const diffH = targetHour - (hours + minutes / 60);
    const remainingMs = diffH * 3600000 / getSpeedMultiplier(hours);
    
    return {
      ...s,
      displayTime,
      nextLabel,
      remaining: formatRemaining(remainingMs)
    };
  });

  renderAll(updated);
}

// Atualiza a cada 1 segundo (tempo simulado)
setInterval(updateDisplay, 1000);

// Atualiza dados da API a cada 1 minutos
setInterval(refreshAll, 60000);

// Primeira execução
refreshAll().then(() => updateDisplay());
