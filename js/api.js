/**
 * api.js
 * "El mensajero": toda la comunicación con football-data.org vive aquí.
 * Las demás páginas (matches.js, groups.js, etc.) solo llaman a estas
 * funciones y no necesitan saber cómo se arma la petición HTTP.
 */

/**
 * Hace un GET a la API de football-data.org, con caché en sessionStorage
 * para no gastar el límite de 10 peticiones/minuto de la capa gratuita.
 * @param {string} endpoint - ej: "/competitions/WC/matches"
 * @returns {Promise<object>} el JSON de la respuesta
 */
async function fetchFromApi(endpoint) {
  const cacheKey = `wc_cache_${endpoint}`;
  const cached = sessionStorage.getItem(cacheKey);

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const isFresh = Date.now() - timestamp < API_CONFIG.CACHE_TTL_MS;
    if (isFresh) {
      return data; // Devolvemos la copia guardada, sin gastar cuota de la API
    }
  }

  // Le pedimos los datos a NUESTRO proxy (mismo dominio → sin CORS),
  // pasándole el endpoint real de football-data.org como parámetro.
  // El proxy es quien agrega el token y llama a la API externa.
  const response = await fetch(
    `${API_CONFIG.BASE_URL}?endpoint=${encodeURIComponent(endpoint)}`
  );

  if (response.status === 429) {
    throw new Error('Se alcanzó el límite de peticiones a la API (10/minuto). Esperá un momento e intentá de nuevo.');
  }
  if (response.status === 403) {
    throw new Error('Esta información requiere un plan superior de football-data.org.');
  }
  if (!response.ok) {
    throw new Error(`Error de la API: ${response.status}`);
  }

  const data = await response.json();

  sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));

  return data;
}

/** Trae todos los partidos del Mundial */
async function getMatches() {
  const data = await fetchFromApi(`/competitions/${API_CONFIG.COMPETITION_CODE}/matches`);
  return data.matches; // La API envuelve el array real dentro de "matches"
}

/** Trae las tablas de posiciones de todos los grupos */
async function getStandings() {
  const data = await fetchFromApi(`/competitions/${API_CONFIG.COMPETITION_CODE}/standings`);
  return data.standings; // Un array con un objeto de tabla por cada grupo
}

/** Trae la lista de goleadores del torneo */
async function getScorers() {
  const data = await fetchFromApi(`/competitions/${API_CONFIG.COMPETITION_CODE}/scorers?limit=10`);
  return data.scorers;
}

/**
 * Calcula "goles a favor" y "goles en contra" por equipo.
 * MEJORA: la API no tiene un endpoint que entregue esto directo, así que
 * lo calculamos nosotros mismos recorriendo todos los partidos finalizados.
 * @param {Array} matches - array de partidos (de getMatches())
 * @returns {{scored: Array, conceded: Array}} equipos ordenados de mayor a menor
 */
function calculateGoalStats(matches) {
  const finished = matches.filter(m => m.status === 'FINISHED');
  const stats = {}; // { "Brazil": { scored: 8, conceded: 2 } }

  finished.forEach(match => {
    const homeGoals = match.score.fullTime.home ?? 0;
    const awayGoals = match.score.fullTime.away ?? 0;
    const homeName = match.homeTeam.name;
    const awayName = match.awayTeam.name;

    if (!stats[homeName]) stats[homeName] = { name: homeName, scored: 0, conceded: 0 };
    if (!stats[awayName]) stats[awayName] = { name: awayName, scored: 0, conceded: 0 };

    stats[homeName].scored += homeGoals;
    stats[homeName].conceded += awayGoals;
    stats[awayName].scored += awayGoals;
    stats[awayName].conceded += homeGoals;
  });

  const teams = Object.values(stats);
  return {
    scored: [...teams].sort((a, b) => b.scored - a.scored),
    conceded: [...teams].sort((a, b) => b.conceded - a.conceded),
  };
}
