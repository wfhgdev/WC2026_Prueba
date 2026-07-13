// js/matches.js
// Renders match cards (from the live API, falling back to mock data),
// then wires up the Scheduled/Live/Finished/All filter buttons.

const matchesGrid = document.getElementById('matches-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// 1. Build a single match card's HTML.
function renderMatchCard(match) {
  const statusBadge = {
    scheduled: `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">UPCOMING</span>`,
    live: `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>${match.minute ? match.minute + "'" : 'LIVE'}</span>`,
    finished: `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-white">FT</span>`,
  }[match.status];

  const score =
    match.status === 'scheduled'
      ? `<div class="text-2xl font-bold text-gray-400">vs</div>`
      : `<div class="text-4xl font-extrabold text-gray-900">${match.homeScore} - ${match.awayScore}</div>`;

  return `
    <div class="match-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" data-status="${match.status}">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">${match.group || match.stage} • Matchday ${match.matchday || ''}</span>
          ${statusBadge}
        </div>
        <div class="flex items-center justify-between gap-4">
          <div class="flex flex-col items-center gap-2 flex-1">
            <img src="${match.homeTeam.flag}" alt="${match.homeTeam.name} flag" class="w-12 h-12 rounded-full object-cover border border-gray-200" />
            <span class="font-bold text-gray-900">${match.homeTeam.name}</span>
          </div>
          ${score}
          <div class="flex flex-col items-center gap-2 flex-1">
            <img src="${match.awayTeam.flag}" alt="${match.awayTeam.name} flag" class="w-12 h-12 rounded-full object-cover border border-gray-200" />
            <span class="font-bold text-gray-900">${match.awayTeam.name}</span>
          </div>
        </div>
      </div>
      <div class="px-6 py-3 bg-gray-50 text-sm text-gray-500 border-t border-gray-100">${match.venue}</div>
    </div>
  `;
}

function renderMatches(matches) {
  if (!matches.length) {
    matchesGrid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-12">No matches found.</p>`;
    return;
  }
  matchesGrid.innerHTML = matches.map(renderMatchCard).join('');
  attachFilterListeners();
}

// 2. Filtering logic — toggles Tailwind's `hidden` class based on data-status.
function filterMatches(selectedStatus) {
  document.querySelectorAll('.match-card').forEach((card) => {
    const matchStatus = card.getAttribute('data-status');
    const show = selectedStatus === 'all' || matchStatus === selectedStatus;
    card.classList.toggle('hidden', !show);
  });

  filterButtons.forEach((btn) => {
    const active = btn.getAttribute('data-filter') === selectedStatus;
    btn.classList.toggle('bg-purple-100', active);
    btn.classList.toggle('text-purple-700', active);
    btn.classList.toggle('bg-gray-100', !active);
    btn.classList.toggle('text-gray-600', !active);
  });
}

function attachFilterListeners() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterMatches(button.getAttribute('data-filter'));
    });
  });
}

// 3. Load data: try the live API first, fall back to mock data on any failure.
async function loadMatches() {
  try {
    const matches = await worldCupApi.getMatches();
    renderMatches(matches);
  } catch (error) {
    console.warn('Live API unavailable, using fallback data:', error.message);
    renderMatches(MOCK_MATCHES);
  }
}

loadMatches();
