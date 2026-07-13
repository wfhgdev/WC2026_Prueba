// js/stats.js
// Renders the Top Scorers table. Falls back to mock data on API failure.

function renderScorerRow(scorer, index) {
  return `
    <div class="flex items-center justify-between py-3 px-2 ${index !== 0 ? 'border-t border-gray-100' : ''}">
      <div class="flex items-center gap-3">
        <span class="text-gray-400 font-semibold w-4">${index + 1}</span>
        <img src="${scorer.player.crest || scorer.player.nationalityFlag || ''}" alt="" class="w-9 h-9 rounded-full object-cover bg-gray-100" />
        <div>
          <p class="font-bold text-gray-900">${scorer.player.name}</p>
          <p class="text-xs text-gray-400">${scorer.player.nationality || ''}</p>
        </div>
      </div>
      <span class="text-xl font-black text-purple-700">${scorer.goals}</span>
    </div>
  `;
}

async function loadTopScorers() {
  const container = document.getElementById('top-scorers-list');
  try {
    const scorers = await worldCupApi.getTopScorers();
    container.innerHTML = scorers.slice(0, 4).map(renderScorerRow).join('');
  } catch (error) {
    console.warn('Live API unavailable, using fallback scorers:', error.message);
    container.innerHTML = MOCK_TOP_SCORERS.map(renderScorerRow).join('');
  }
}

loadTopScorers();
