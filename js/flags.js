/**
 * flags.js
 * football-data.org no entrega banderas, solo el nombre del país/equipo.
 * flagcdn.com sí entrega banderas, pero necesita el código ISO-2
 * (ej: "fr" para Francia). Este archivo traduce nombre -> código.
 */

// Mapa de nombre de país/selección (como lo devuelve la API) -> código ISO-2
const COUNTRY_CODE_MAP = {
  'Argentina': 'ar', 'Australia': 'au', 'Austria': 'at', 'Belgium': 'be',
  'Bolivia': 'bo', 'Brazil': 'br', 'Cameroon': 'cm', 'Canada': 'ca',
  'Chile': 'cl', 'China': 'cn', 'Colombia': 'co', 'Costa Rica': 'cr',
  'Croatia': 'hr', 'Curacao': 'cw', 'Denmark': 'dk', 'Ecuador': 'ec',
  'Egypt': 'eg', 'England': 'gb-eng', 'France': 'fr', 'Germany': 'de',
  'Ghana': 'gh', 'Greece': 'gr', 'Haiti': 'ht', 'Honduras': 'hn',
  'Iceland': 'is', 'Iran': 'ir', 'Iraq': 'iq', 'Ivory Coast': 'ci',
  "Cote d'Ivoire": 'ci', 'Ivory Coast': 'ci', 'Jamaica': 'jm', 'Japan': 'jp',
  'Jordan': 'jo', 'Mexico': 'mx', 'Morocco': 'ma', 'Netherlands': 'nl',
  'New Zealand': 'nz', 'Nigeria': 'ng', 'North Macedonia': 'mk',
  'Norway': 'no', 'Panama': 'pa', 'Paraguay': 'py', 'Peru': 'pe',
  'Poland': 'pl', 'Portugal': 'pt', 'Qatar': 'qa', 'Republic of Ireland': 'ie',
  'Saudi Arabia': 'sa', 'Scotland': 'gb-sct', 'Senegal': 'sn',
  'Serbia': 'rs', 'South Africa': 'za', 'South Korea': 'kr',
  'Korea Republic': 'kr', 'Spain': 'es', 'Sweden': 'se',
  'Switzerland': 'ch', 'Tunisia': 'tn', 'Turkey': 'tr', 'Ukraine': 'ua',
  'United States': 'us', 'USA': 'us', 'Uruguay': 'uy', 'Uzbekistan': 'uz',
  'Venezuela': 've', 'Wales': 'gb-wls', 'Algeria': 'dz', 'Cabo Verde': 'cv',
  'Cape Verde': 'cv',
};

/**
 * Devuelve la URL de la bandera de un país usando flagcdn.com
 * @param {string} countryName - nombre del país tal como lo da la API
 * @param {string} width - ancho de la imagen (ej: "w40", "w80")
 * @returns {string} URL de la imagen de la bandera
 */
function getFlagUrl(countryName, width = 'w80') {
  const code = COUNTRY_CODE_MAP[countryName];
  // Si no encontramos el país en el mapa, usamos una bandera "vacía"
  // de la ONU como respaldo, para que la app no se rompa visualmente
  return code
    ? `https://flagcdn.com/${width}/${code}.png`
    : `https://flagcdn.com/${width}/un.png`;
}
