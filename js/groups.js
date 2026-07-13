// js/groups.js
// Renders one standings table per group. Falls back to a static
// two-group sample if the live API call fails.

const MOCK_STANDINGS = [
  {
    group: 'GROUP_A',
    table: [
      { position: 1, team: { name: 'Argentina', crest: 'https://flagcdn.com/ar.svg' }, points: 6, playedGames: 2, won: 2, draw: 0, lost: 0, goalDifference: 4 },
      { position: 2, team: { name: 'Netherlands', crest: 'https://flagcdn.com/nl.svg' }, points: 4, playedGames: 2, won: 1, draw: 1, lost: 0, goalDifference: 2 },
      { position: 3, team: { name: 'Senegal', crest: 'https://flagcdn.com/sn.svg' }, points: 1, playedGames: 2, won: 0, draw: 1, lost: 1, goalDifference: -1 },
      { position: 4, team: { name: 'Qatar', crest: 'https://flagcdn.com/qa.svg' }, points: 0, playedGames: 2, won: 0, draw: 0, lost: 2, goalDifference: -5 },
    ],
  },
  {
    group: 'GROUP_B',
    table: [
      { position: 1, team: { name: 'England', crest: 'https://flagcdn.com/gb-eng.svg' }, points: 7, playedGames: 3, won: 2, draw: 1, lost: 0, goalDifference: 7 },
      { position: 2, team: { name: 'USA', crest: 'https://flagcdn.com/us.svg' }, points: 5, playedGames: 3, won: 1, draw: 2, lost: 0, goalDifference: 1 },
      { position: 3, team: { name: 'Iran', crest: 'https://flagcdn.com/ir.svg' }, points: 3, playedGames: 3, won: 1, draw: 0, lost: 2, goalDifference: -3 },
      { position: 4, team: { name: 'Wales', crest: 'https://flagcdn.com/gb-wls.svg' }, points: 1, playedGames: 3, won: 0, draw: 1, lost: 2, goalDifference: -5 },
    ],
  },
];

function renderGroupTable(group) {
  const groupLabel = group.group.replace('GROUP_', 'Group ');
  const rows = group.table
    .map(
      (row) => `
      <tr class="border-t border-gray-100">
        <td class="py-3 px-2 font-bold text-gray-900">${row.position}</td>
        <td class="py-3 px-2 flex items-center gap-3">
          <img src="${row.team.crest}" class="w-6 h-6 rounded-full object-cover" alt="${row.team.name} flag" />
          <span class="font-semibold text-gray-900">${row.team.name}</span>
        </td>
        <td class="py-3 px-2 font-bold text-right">${row.points}</td>
        <td class="py-3 px-2 text-right text-gray-500">${row.playedGames}</td>
        <td class="py-3 px-2 text-right text-gray-500">${row.won}</td>
        <td class="py-3 px-2 text-right text-gray-500">${row.draw}</td>
        <td class="py-3 px-2 text-right text-gray-500">${row.lost}</td>
        <td class="py-3 px-2 text-right font-semibold">${row.goalDifference > 0 ? '+' : ''}${row.goalDifference}</td>
      </tr>`
    )
    .join('');

  return `
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="bg-gray-900 text-white px-6 py-4 font-bold text-lg">${groupLabel}</div>
      <table class="w-full text-sm">
        <thead class="text-gray-400 text-xs uppercase">
          <tr>
            <th class="text-left py-2 px-2">Pos</th>
            <th class="text-left py-2 px-2">Team</th>
            <th class="text-right py-2 px-2">Pts</th>
            <th class="text-right py-2 px-2">MP</th>
            <th class="text-right py-2 px-2">W</th>
            <th class="text-right py-2 px-2">D</th>
            <th class="text-right py-2 px-2">L</th>
            <th class="text-right py-2 px-2">GD</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

async function loadStandings() {
  const container = document.getElementById('groups-container');
  try {
    const standings = await worldCupApi.getStandings();
    container.innerHTML = standings.map(renderGroupTable).join('');
  } catch (error) {
    console.warn('Live API unavailable, using fallback standings:', error.message);
    container.innerHTML = MOCK_STANDINGS.map(renderGroupTable).join('');
  }
}

loadStandings();
