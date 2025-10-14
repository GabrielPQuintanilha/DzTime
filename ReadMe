🕒 DzTime v2.4 — Single Script Edition
📘 Sobre

DzTime é um web app criado por Gabriel Quintanilha que exibe informações em tempo real sobre servidores DayZ listados na BattleMetrics API.

A versão 2.1 aprimora o suporte a múltiplos servidores, adiciona o campo de mapa (Chernarus / Livonia), atualiza a lógica de tempo simulada para cada um deles e reduz o intervalo de atualização da API para 1 minuto.

🔗 **Acesse aqui:** [https://gabrielpquintanilha.github.io/DzTime/](https://gabrielpquintanilha.github.io/DzTime/)

🧠 Objetivo

Monitorar o horário interno de servidores DayZ e calcular o tempo restante até o anoitecer (18h) ou amanhecer (6h) dentro do jogo — auxiliando jogadores a planejarem login e ações com base no ciclo de tempo acelerado de cada mapa.

⚙️ Estrutura do código

/DzTime
 ├── index.html        → Estrutura principal da página
 ├── style.css         → Estilos visuais
 ├── main.js           → Execução principal e lógica de atualização
 ├── api.js            → Comunicação com a API BattleMetrics
 ├── config.js         → Configurações gerais e lista de servidores
 ├── utils.js          → Funções auxiliares (tempo, formatação, cálculo)
 └── render.js         → Renderização e atualização dos cards no DOM

🧩 Tecnologias

- HTML + CSS + JavaScript puro

- BattleMetrics API

- AllOrigins (proxy CORS)

- GitHub Pages (deploy)

💡 Funcionamento

1. O script consulta os servidores definidos:

https://api.allorigins.win/raw?url=https://api.battlemetrics.com/servers/[ID]


2. Exibe para cada servidor:

- Nome

- Mapa (Chernarus / Livonia)

- Status (online/offline)

- Jogadores ativos

- Horário interno (tempo simulado)

- Tempo restante até o próximo marco (06h ou 18h)

3. Atualizações automáticas:

- Exibição: a cada 1 segundo

- Dados da API: a cada 1 minuto

🕒 Lógica de tempo no jogo

A velocidade do tempo em DayZ varia conforme o mapa e o período do dia.
O sistema do DzTime simula isso automaticamente:

Mapa	Período	Multiplicador
Chernarus	Dia (06h–18h)	4.2x
Chernarus	Noite (18h–06h)	16.8x
Livonia	Dia (06h–18h)	5.4x
Livonia	Noite (18h–06h)	≈11.7x (5.4 × 2.17)

Esses multiplicadores são aplicados automaticamente com base no campo map definido no array SERVERS.

⚙️ Estrutura do array de servidores
const SERVERS = [
  { id: "27886151", label: "0724 | SOUTH AMERICA - SP | 1st Person Only", map: "Chernarus" },
  { id: "29986609", label: "0742 | SOUTH AMERICA - SP | 1st Person Only", map: "Livonia" },
];

🚀 Instalação

1. Faça fork deste repositório.

2. Abra o arquivo index.html no navegador ou publique via GitHub Pages.

3. A página será atualizada automaticamente, exibindo o status em tempo real.

🧱 Changelog

v2.4

- Modularização do código
- Correção dos links de mapa quebrados
- Nome do servidor agora obtido dinamicamente da API

v2.3

- Links clicáveis para os mapas **Chernarus** e **Livonia**, abrindo diretamente no **dayz.xam.nu**.
- Exibição automática da **versão do programa** no rodapé.
- Corrigido efeito de “piscada” nos cards ao passar o mouse, causado pela recriação constante do HTML.

v2.2

- Atualizações de servidores agora ocorrem em paralelo (Promise.all) para evitar atrasos entre mapas.

- Removida a simulação de tempo local (advanceSimulatedTime), exibindo o horário exatamente como fornecido pela API BattleMetrics.

- Intervalo de atualização da API ajustado para 1 minuto.

- Código simplificado e mais estável para execução em GitHub Pages.

v2.1

- Adicionado campo map (Chernarus / Livonia).

- Lógica de tempo ajustada para multiplicadores específicos de cada mapa.

- Atualização da API reduzida de 2 minutos para 1 minuto.

- Renderização aprimorada com exibição do nome do mapa.

v2.0 — Single Script Edition

- Código consolidado em um único arquivo de script.

- Suporte a múltiplos servidores.

- Simulação de tempo baseada em multiplicadores diurno/noturno (4.2x / 16.8x).

- Interface aprimorada e mais leve.

## 🐞 Known Issues
- BattleMetrics e proxies públicos (como AllOrigins) podem falhar temporariamente com erro CORS 500.

- Caso o proxy esteja offline, o horário exibido pode congelar até a próxima atualização bem-sucedida.

- O horário exibido é exato da API — sem compensação de defasagem de atualização.

🧾 Licença

Uso livre para fins educacionais e de hobby.
Autor: Gabriel Quintanilha — Rio de Janeiro, 2025.