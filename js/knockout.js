// js/knockout.js
// Renders the full 5-round bracket: Round of 32 → Round of 16 →
// Quarterfinals → Semifinals → Final. The earlier mockup skipped the
// Quarterfinal and Semifinal columns — this fixes that by explicitly
// listing every stage football-data.org exposes for a 32-team event.

const STAGES = [
  { code: 'LAST_32', label: 'Round of 32' },
  { code: 'LAST_16', label: 'Round of 16' },
  { code: 'QUARTER_FINALS', label: 'Quarterfinals' },
  { code: 'SEMI_FINALS', label: 'Semifinals' },
  { code: 'FINAL', label: 'Final' },
];

// Minimal fallback so the 5-column structure is visible even offline.
// Only a couple of matches per stage — enough to prove the layout is fixed.
const MOCK_KNOCKOUT = {
  LAST_32: [
    { id: 'm49', homeTeam: { name: 'ARG' }, awayTeam: { name: 'MEX' }, homeScore: 2, awayScore: 0, status: 'finished' },
    { id: 'm50', homeTeam: { name: 'FRA' }, awayTeam: { name: 'USA' }, homeScore: 3, awayScore: 1, status: 'finished' },
  ],
  LAST_16: [
    { id: 'm65', homeTeam: { name: 'ARG' }, awayTeam: { name: 'FRA' }, homeScore: 2, awayScore: 1, status: 'finished' },
  ],
  QUARTER_FINALS: [
    { id: 'qf1', homeTeam: { name: 'ARG' }, awayTeam: { name: 'TBD' }, homeScore: null, awayScore: null, status: 'scheduled' },
  ],
  SEMI_FINALS: [
    { id: 'sf1', homeTeam: { name: 'TBD' }, awayTeam: { name: 'TBD' }, homeScore: null, awayScore: null, status: 'scheduled' },
  ],
  FINAL: [
    { id: 'f1', homeTeam: { name: 'ARG' }, awayTeam: { name: 'ENG' }, homeScore: 1, awayScore: 1, status: 'live' },
  ],
};

function renderBracketCard(match) {
  const score =
    match.status === 'scheduled'
      ? '<span class="text-gray-400">vs</span>'
      : `<span class="font-bold">${match.homeScore ?? '-'} - ${match.awayScore ?? '-'}</span>`;

  return `
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
      <div class="flex justify-between text-xs text-gray-400 mb-2">
        <span>${match.homeTeam.name} vs ${match.awayTeam.name}</span>
        ${match.status === 'live' ? '<span class="text-purple-700 font-semibold">LIVE</span>' : ''}
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold text-gray-900">${match.homeTeam.name}</span>
        ${score}
        <span class="font-semibold text-gray-900">${match.awayTeam.name}</span>
      </div>
    </div>
  `;
}

function renderColumn(stage, matches) {
  return `
    <div class="min-w-[220px]">
      <h3 class="text-purple-700 font-black uppercase text-sm mb-4 border-b-2 border-purple-700 pb-2">${stage.label}</h3>
      ${matches.length ? matches.map(renderBracketCard).join('') : '<p class="text-gray-300 text-sm">TBD</p>'}
    </div>
  `;
}

async function loadBracket() {
  const container = document.getElementById('bracket-container');
  const columns = [];

  for (const stage of STAGES) {
    try {
      const matches = await worldCupApi.getMatchesByStage(stage.code);
      columns.push(renderColumn(stage, matches));
    } catch (error) {
      console.warn(`Live API unavailable for ${stage.code}, using fallback:`, error.message);
      columns.push(renderColumn(stage, MOCK_KNOCKOUT[stage.code] || []));
    }
  }

  container.innerHTML = columns.join('');
}

loadBracket();
