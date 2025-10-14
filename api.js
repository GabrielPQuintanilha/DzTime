import { API_PROXY } from './config.js';

export async function fetchServer(id) {
  const url = `${API_PROXY}${encodeURIComponent(`https://api.battlemetrics.com/servers/${id}`)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao acessar API");
  const json = await res.json();
  return json.data.attributes;
}

