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
function getSpeedMultiplier(hour, map) {
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
  // Se for a primeira renderização, remove o texto padrão
  if (OUTPUT.innerHTML.includes("Carregando informações")) {
    OUTPUT.innerHTML = "";
  }

  state.forEach((s) => {
    let card = document.querySelector(`[data-id="${s.label}"]`);
    if (!card) {
      card = document.createElement("div");
      card.className = "server-card";
      card.dataset.id = s.label;
      card.innerHTML = `
        <h2>${s.label}</h2>
        <p><b>Mapa:</b> 
          <a href="#" target="_blank" class="map-link">${s.map}</a>
        </p>
        <p><b>Status:</b> <span class="${s.status}">${s.status}</span></p>
        <p><b>Players:</b> <span class="players">${s.players}</span></p>
        <p><b>Server Time:</b> <span class="time">${s.displayTime}</span></p>
        <p><b>Restante até ${s.nextLabel}:</b> <span class="remaining">${s.remaining}</span></p>
      `;
      OUTPUT.appendChild(card);
    } else {
      card.querySelector(".players").textContent = s.players;
      card.querySelector(".time").textContent = s.displayTime;
      card.querySelector(".remaining").textContent = s.remaining;
      const statusEl = card.querySelector("span");
      statusEl.className = s.status;
      statusEl.textContent = s.status;
    }
  });
}


/* #---------Execução principal---------# */

const serverState = {}; // id -> { baseTime, lastUpdate, status, players, etc }

async function refreshAll() {
  await Promise.all(SERVERS.map(async (s) => {
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
  }));
}



function updateDisplay() {
  const updated = Object.entries(serverState).map(([id, s]) => {
    const simTime = s.baseTime; // sempre o horário exato da API
    const hours = simTime.getHours();
    const minutes = simTime.getMinutes().toString().padStart(2, "0");
    const displayTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
    
    // Próximo marco
    let nextLabel, targetHour;
    if (hours >= 6 && hours < 18) {
      nextLabel = "18h";
      targetHour = 18;
    } else if (hours >= 18 && hours < 24) {
      nextLabel = "06h";
      targetHour = 30;
    } else {
      nextLabel = "06h";
      targetHour = 6;
    }

    const diffH = targetHour - (hours + minutes / 60);
    const remainingMs = diffH * 3600000 / getSpeedMultiplier(hours, s.map);

    return {
      ...s,
      displayTime,
      nextLabel,
      remaining: formatRemaining(remainingMs)
    };
  });

  renderAll(updated);
}




// Atualiza a cada 500ms 
setInterval(updateDisplay, 500);

// Atualiza dados da API a cada 1 minuto
setInterval(refreshAll, 30000);


// Primeira execução
refreshAll().then(() => updateDisplay());
