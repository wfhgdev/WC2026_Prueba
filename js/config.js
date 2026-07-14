/**
 * config.js
 * Configuración central de la API de football-data.org.
 * Todas las páginas cargan este archivo primero.
 *
 * ADVERTENCIA DE SEGURIDAD:
 * Este token queda visible en el código fuente que recibe el navegador
 * (cualquiera puede verlo con las DevTools). Para una API gratuita de
 * solo lectura como esta es un riesgo aceptable, pero si este proyecto
 * creciera a producción real, lo correcto sería mover las llamadas a
 * un backend/proxy propio que oculte el token.
 */
const API_CONFIG = {
  TOKEN: 'f97d70b1c3f54fa38cd4d9ab444f4073',
  BASE_URL: 'https://api.football-data.org/v4',
  COMPETITION_CODE: 'WC', // Código de la Copa del Mundo en football-data.org
  // La API gratuita permite 10 peticiones por minuto: cacheamos las
  // respuestas en sessionStorage por este tiempo para no agotar el límite
  // al navegar entre páginas (Matches, Groups, Knockout, Stats)
  CACHE_TTL_MS: 60 * 1000, // 60 segundos
};
