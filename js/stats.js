/**
 * stats.js
 * Lógica de stats.html: goleadores, goles a favor y goles en contra por equipo.
 *
 * Usamos Promise.allSettled (en vez de esperar ambas peticiones juntas)
 * para que, si una de las dos falla (por ejemplo "scorers" pide un plan
 * pago), la otra igual se pueda mostrar en vez de romper toda la página.
 */

const scorersEl = document.querySelector('#top-scorers');
const scoredEl = document.querySelector('#most-goals-scored');
const concededEl = document.querySelector('#goals-conceded');

async function initStatsPage() {
  scorersEl.innerHTML = `<p class="text-sm text-gray-400 p-4">Cargando…</p>`;
  scoredEl.innerHTML = `<p class="text-sm text-gray-400 p-4">Cargando…</p>`;
  concededEl.innerHTML = `<p class="text-sm text-gray-400 p-4">Cargando…</p>`;

  const [scorersResult, matchesResult] = await Promise.allSettled([
    getScorers(),
    getMatches(),
  ]);

  if (scorersResult.status === 'fulfilled') {
    renderScorers(scorersResult.value);
  } else {
    console.error('Error al cargar goleadores:', scorersResult.reason);
    renderError(scorersEl, scorersResult.reason.message);
  }

  if (matchesResult.status === 'fulfilled') {
    const { scored, conceded } = calculateGoalStats(matchesResult.value);
    renderTeamGoals(scoredEl, scored, 'scored');
    renderTeamGoals(concededEl, conceded, 'conceded');
  } else {
    console.error('Error al cargar partidos:', matchesResult.reason);
    renderError(scoredEl, matchesResult.reason.message);
    renderError(concededEl, matchesResult.reason.message);
  }
}

function renderScorers(scorers) {
  if (!scorers || scorers.length === 0) {
    scorersEl.innerHTML = `<p class="text-sm text-gray-400 p-4">Todavía no hay goleadores registrados.</p>`;
    return;
  }

  scorersEl.innerHTML = scorers.slice(0, 4).map((entry, index) => `
    <div class="flex items-center justify-between px-6 py-4 ${index > 0 ? 'border-t border-gray-100' : ''}">
      <div class="flex items-center gap-4">
        <span class="text-gray-400 font-bold w-4">${index + 1}</span>
        ${flagImgHTML(entry.player.nationality, 'w-9 h-9')}
        <div>
          <p class="font-bold leading-tight">${entry.player.name}</p>
          <p class="text-xs text-gray-400">${entry.team.tla || entry.team.name}</p>
        </div>
      </div>
      <span class="text-xl font-black text-indigo-600">${entry.goals}</span>
    </div>
  `).join('');
}

function renderTeamGoals(container, teams, mode) {
  if (!teams || teams.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-400 p-4">Todavía no hay partidos finalizados.</p>`;
    return;
  }

  const valueClass = mode === 'conceded' ? 'text-red-600' : 'text-gray-900';

  container.innerHTML = teams.slice(0, 4).map((team, index) => `
    <div class="flex items-center justify-between px-6 py-4 ${index > 0 ? 'border-t border-gray-100' : ''}">
      <div class="flex items-center gap-4">
        <span class="text-gray-400 font-bold w-4">${index + 1}</span>
        ${flagImgHTML(team.name, 'w-9 h-9')}
        <span class="font-bold">${team.name}</span>
      </div>
      <span class="text-xl font-black ${valueClass}">${mode === 'conceded' ? team.conceded : team.scored}</span>
    </div>
  `).join('');
}

initStatsPage();
