const OUTPUT = document.getElementById("output");

// função auxiliar pra escolher o link conforme o mapa
function getMapLink(map) {
    switch (map) {
        case "Chernarus":
        return "https://dayz.xam.nu/chernarusplus";
        case "Livonia":
        return "https://dayz.xam.nu/livonia";
        default:
        return "teste";
    }
}

export function renderAll(state) {
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
          <a href="${getMapLink(s.map)}" target="_blank" class="map-link">${s.map}</a>
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