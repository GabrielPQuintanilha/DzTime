import { API_PROXIES } from './config.js';

export async function fetchServer(id) {
  const target = `https://api.battlemetrics.com/servers/${id}`;

  for (const proxy of API_PROXIES) {
    const url = `${proxy}${encodeURIComponent(target)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Proxy falhou: ${proxy}`);

      const json = await res.json();
      return json.data.attributes; // sucesso → retorna imediatamente
    } catch (err) {
      console.warn(`⚠️ Falha com proxy: ${proxy}`);
    }
  }

  throw new Error("Todos os proxies falharam ao acessar a API.");
}

