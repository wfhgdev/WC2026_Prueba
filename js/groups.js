/**
 * groups.js
 * Lógica de groups.html: pinta la tabla de posiciones de cada grupo.
 */

const groupsGrid = document.querySelector('#groups-grid');

async function initGroupsPage() {
  groupsGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Cargando grupos…</p>`;

  try {
    const standings = await getStandings();
    renderGroups(standings);
  } catch (error) {
    console.error('Error al cargar los grupos:', error);
    renderError(groupsGrid, error.message);
  }
}

/** Dibuja una tarjeta de tabla de posiciones por cada grupo */
function renderGroups(standings) {
  if (!standings || standings.length === 0) {
    groupsGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Los grupos todavía no están definidos.</p>`;
    return;
  }

  groupsGrid.innerHTML = standings.map(groupTableHTML).join('');
}

/** Construye el HTML de la tabla de un grupo individual */
function groupTableHTML(group) {
  const rows = group.table.map(row => `
    <tr class="border-t border-gray-100">
      <td class="py-3 pl-2 relative">
        <span class="absolute left-0 top-0 bottom-0 w-1 ${row.position <= 2 ? 'bg-emerald-400' : 'bg-transparent'}"></span>
        <span class="font-bold text-gray-500 pl-2">${row.position}</span>
      </td>
      <td class="py-3">
        <div class="flex items-center gap-3">
          ${flagImgHTML(row.team.name, 'w-6 h-6')}
          <span class="font-semibold">${row.team.name}</span>
        </div>
      </td>
      <td class="py-3 text-center font-bold">${row.points}</td>
      <td class="py-3 text-center text-gray-500">${row.playedGames}</td>
      <td class="py-3 text-center text-gray-500">${row.won}</td>
      <td class="py-3 text-center text-gray-500">${row.draw}</td>
      <td class="py-3 text-center text-gray-500">${row.lost}</td>
      <td class="py-3 text-center text-gray-500">${row.goalDifference > 0 ? '+' : ''}${row.goalDifference}</td>
    </tr>
  `).join('');

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-slate-900 text-white px-6 py-4">
        <h2 class="text-xl font-black">${translateGroup(group.group) || 'Grupo'}</h2>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs text-gray-400 uppercase">
            <th class="py-2 pl-2">Pos</th>
            <th class="py-2">Equipo</th>
            <th class="py-2 text-center">Pts</th>
            <th class="py-2 text-center">PJ</th>
            <th class="py-2 text-center">G</th>
            <th class="py-2 text-center">E</th>
            <th class="py-2 text-center">P</th>
            <th class="py-2 text-center">DG</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

initGroupsPage();
