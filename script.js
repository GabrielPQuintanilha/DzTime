//---------head--------------//
// Nome: DzTime
// Autor: Gabriel Quintanilha
//---------------------------//

//---------Exemplo-----------//
// Web app que mostra horário do servidor e informações relevantes
//---------------------------//

//---------Teste-------------//
console.log("Iniciando DzTime...");
if (!window.fetch) {
  console.error("Erro: o navegador não suporta fetch().");
}
//---------------------------//

//---------Variáveis---------//
const serverId = "27886151";
const apiUrl = `https://api.battlemetrics.com/servers/${serverId}`;
const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
const output = document.getElementById("output");
//---------------------------//

//---------Execução----------//
async function carregarDados() {
  try {
    const response = await fetch(proxyUrl);
    const json = await response.json();
    const data = json.data.attributes;

    const nome = data.name;
    const players = data.players;
    const status = data.status;
    const horaServer = data.details.time; // vem tipo "15:05"

    // Garantir formato válido
    if (!horaServer || !/^\d{2}:\d{2}$/.test(horaServer)) {
      throw new Error("Formato de hora inválido recebido da API.");
    }

    // Converter para hora local (com base no horário do servidor)
    const [h, m] = horaServer.split(":").map(Number);
    const horarioServidor = new Date();
    horarioServidor.setHours(h, m, 0, 0);

    // Calcular tempo restante até 18h ou 6h
    let proximoHorario = new Date(horarioServidor);
    if (h >= 18) {
      proximoHorario.setHours(6, 0, 0, 0);
      proximoHorario.setDate(proximoHorario.getDate() + 1);
    } else {
      proximoHorario.setHours(18, 0, 0, 0);
    }

    const diffMs = proximoHorario - horarioServidor;
    const diffH = Math.floor(diffMs / 1000 / 60 / 60);
    const diffM = Math.floor((diffMs / 1000 / 60) % 60);

    // Estilo de status
    const statusClass = status === "online" ? "online" : "offline";

    output.innerHTML = `
      <div class="card">
        <h2>${nome}</h2>
        <p><strong>Jogadores:</strong> ${players}</p>
        <p><strong>Status:</strong> <span class="${statusClass}">${status}</span></p>
        <p><strong>Horário do servidor:</strong> ${horaServer}</p>
        <p><strong>Tempo restante até ${h >= 18 ? "06h" : "18h"}:</strong> ${diffH}h ${diffM}min</p>
      </div>
    `;
  } catch (err) {
    output.innerHTML = `
      <div class="error">
        Erro ao carregar dados do servidor 😢<br>
        ${err.message}
      </div>
    `;
    console.error("Erro:", err);
  }
}

// Atualiza a cada 2 minutos
carregarDados();
setInterval(carregarDados, 120000);
//---------------------------//

//---------Footer------------//
console.log("DzTime iniciado com sucesso!");
//---------------------------//
