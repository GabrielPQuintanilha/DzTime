/* 
#---------head--------------#
# Nome: DzTime
# Autor: Gabriel Quintanilha
#---------------------------#
# Versão: 2.5 (Single Script Edition)
# Web app que mostra horário do server e informações relevantes
*/

/* #---------Configuração---------# */

import { SERVERS } from './config.js';

/* #---------Utilidades---------# */

import { parseTimeString, getSpeedMultiplier, formatRemaining } from './utils.js';

/* #---------Serviço da API---------# */

import { fetchServer } from './api.js';

/* #---------Renderização---------# */

import { renderAll } from './render.js';

/* #---------Execução principal---------# */

const serverState = {}; // id -> { baseTime, lastUpdate, status, players, etc }

async function refreshAll() {
  await Promise.all(SERVERS.map(async (s) => {
    try {
      const attrs = await fetchServer(s.id);

      const baseTime = parseTimeString(attrs.details.time);

      serverState[s.id] = {
        label: attrs.name,
        map: s.map,
        status: attrs.status,
        players: attrs.players,
        baseTime,
        lastUpdate: Date.now()
      };
    } catch (err) {
      serverState[s.id] = {
        label:"-",
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




// Atualiza a cada 1 segundo 
setInterval(updateDisplay, 1000);

// Atualiza dados da API a cada 1 minuto
setInterval(refreshAll, 30000);


// Primeira execução
refreshAll().then(() => updateDisplay());
