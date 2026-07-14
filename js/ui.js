/**
 * ui.js
 * Funciones de interfaz que se repiten en varias páginas: traducir
 * estados de partido, formatear fechas y construir la tarjeta de partido.
 * Se usa tanto en matches.js como en knockout.js.
 */

// Traduce el "status" que da la API a algo entendible en español,
// y también lo agrupa en una de las 4 categorías de filtro del index
const STATUS_INFO = {
  SCHEDULED: { label: 'Programado', filterGroup: 'scheduled', badge: 'bg-gray-200 text-gray-700' },
  TIMED: { label: 'Programado', filterGroup: 'scheduled', badge: 'bg-gray-200 text-gray-700' },
  POSTPONED: { label: 'Pospuesto', filterGroup: 'scheduled', badge: 'bg-gray-200 text-gray-700' },
  SUSPENDED: { label: 'Suspendido', filterGroup: 'scheduled', badge: 'bg-gray-200 text-gray-700' },
  IN_PLAY: { label: 'EN VIVO', filterGroup: 'live', badge: 'bg-purple-100 text-purple-700' },
  PAUSED: { label: 'ENTRETIEMPO', filterGroup: 'live', badge: 'bg-purple-100 text-purple-700' },
  FINISHED: { label: 'Finalizado', filterGroup: 'finished', badge: 'bg-gray-800 text-white' },
  AWARDED: { label: 'Finalizado', filterGroup: 'finished', badge: 'bg-gray-800 text-white' },
  CANCELLED: { label: 'Cancelado', filterGroup: 'scheduled', badge: 'bg-gray-200 text-gray-700' },
};

const STAGE_LABELS = {
  LAST_64: 'Ronda de 64',
  LAST_32: 'Ronda de 32',
  GROUP_STAGE: 'Fase de Grupos',
  LAST_16: 'Octavos de Final',
  ROUND_OF_16: 'Octavos de Final',
  QUARTER_FINALS: 'Cuartos de Final',
  SEMI_FINALS: 'Semifinal',
  FINAL: 'Final',
  THIRD_PLACE: 'Tercer Puesto',
};

// Orden en el que se muestran las rondas eliminatorias en knockout.html
const KNOCKOUT_STAGE_ORDER = ['LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'];

/** Traduce "Group A" -> "Grupo A" */
function translateGroup(group) {
  if (!group) return '';
  return group.replace('Group', 'Grupo');
}

/** Formatea la fecha UTC del partido a un texto corto en español, ej: "1 jul, 19:00" */
function formatMatchDate(utcDate) {
  const date = new Date(utcDate);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Hoy, ${time}`;

  const day = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  return `${day}, ${time}`;
}

/**
 * Devuelve el HTML de la etiqueta <img> de una bandera, con "onerror"
 * para ocultarla sin romper el diseño si flagcdn no tiene ese código
 */
function flagImgHTML(countryName, sizeClasses = 'w-10 h-10') {
  const url = getFlagUrl(countryName);
  return `<img src="${url}" alt="Bandera de ${countryName}" class="${sizeClasses} rounded-full object-cover border border-gray-200" onerror="this.style.visibility='hidden'">`;
}

/**
 * Construye el HTML de una tarjeta de partido (usada en Matches y Knockout).
 * data-status guarda la categoría de filtro ("scheduled" | "live" | "finished")
 */
function matchCardHTML(match) {
  const info = STATUS_INFO[match.status] || STATUS_INFO.SCHEDULED;
  const homeGoals = match.score.fullTime.home;
  const awayGoals = match.score.fullTime.away;
  const hasScore = homeGoals !== null && homeGoals !== undefined;

  return `
    <div class="match-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" data-status="${info.filterGroup}">
      <div class="p-5">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">
            ${translateGroup(match.group) || STAGE_LABELS[match.stage] || ''} ${match.matchday ? '• Jornada ' + match.matchday : ''}
          </span>
          <span class="text-xs font-semibold px-3 py-1 rounded-full ${info.badge}">${info.label}</span>
        </div>

        <div class="flex items-center justify-between gap-3">
          <div class="flex flex-col items-center gap-2 flex-1">
            ${flagImgHTML(match.homeTeam.name)}
            <span class="font-bold text-sm text-center">${match.homeTeam.tla || match.homeTeam.shortName}</span>
          </div>

          <div class="text-center px-2">
            ${hasScore
              ? `<span class="text-3xl font-black">${homeGoals} - ${awayGoals}</span>`
              : `<span class="text-lg font-bold text-gray-700">${formatMatchDate(match.utcDate)}</span>`}
          </div>

          <div class="flex flex-col items-center gap-2 flex-1">
            ${flagImgHTML(match.awayTeam.name)}
            <span class="font-bold text-sm text-center">${match.awayTeam.tla || match.awayTeam.shortName}</span>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 px-5 py-3 text-xs text-gray-500 border-t border-gray-100">
        ${match.venue || 'Sede por confirmar'}
      </div>
    </div>
  `;
}

/** Muestra un mensaje de error visible dentro de un contenedor */
function renderError(container, message) {
  container.innerHTML = `
    <div class="col-span-full bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
      <p class="font-semibold mb-1">No se pudo cargar la información</p>
      <p class="text-sm">${message}</p>
    </div>
  `;
}

/** Muestra tarjetas "esqueleto" (grises, animadas) mientras carga */
function renderSkeletons(container, count = 3) {
  container.innerHTML = Array.from({ length: count }).map(() => `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
      <div class="h-3 w-1/3 bg-gray-200 rounded mb-6"></div>
      <div class="flex items-center justify-between">
        <div class="w-10 h-10 rounded-full bg-gray-200"></div>
        <div class="h-6 w-16 bg-gray-200 rounded"></div>
        <div class="w-10 h-10 rounded-full bg-gray-200"></div>
      </div>
    </div>
  `).join('');
}
