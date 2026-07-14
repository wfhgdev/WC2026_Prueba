/**
 * config.js
 * Configuración central de la API de football-data.org.
 * Todas las páginas cargan este archivo primero.
 *
 * IMPORTANTE:
 * Ya no llamamos a football-data.org directamente desde el navegador
 * (eso causaba el error de CORS). En su lugar, le pedimos los datos a
 * nuestro propio proxy en /api/football, que corre en el servidor de
 * Vercel y reenvía la petición con el token oculto.
 * El token real vive como variable de entorno FOOTBALL_DATA_TOKEN en
 * el panel de Vercel (Settings → Environment Variables), no aquí.
 */
const API_CONFIG = {
  BASE_URL: '/api/football', // Nuestro proxy propio, no la API externa
  COMPETITION_CODE: 'WC', // Código de la Copa del Mundo en football-data.org
  // La API gratuita permite 10 peticiones por minuto: cacheamos las
  // respuestas en sessionStorage por este tiempo para no agotar el límite
  // al navegar entre páginas (Matches, Groups, Knockout, Stats)
  CACHE_TTL_MS: 60 * 1000, // 60 segundos
};
