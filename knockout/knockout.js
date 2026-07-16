// ============================================
// PÁGINA: Fase Eliminatoria - Árbol de Eliminatorias (i18n)
// Genera el bracket visual tipo torneo
// ============================================

/**
 * Llenar una tarjeta de partido en el bracket
 */
function fillMatchCard(card, match) {
  if (!match) return;

  const homeScore = match.score?.fullTime?.home;
  const awayScore = match.score?.fullTime?.away;
  const isFinished = match.status === 'FINISHED';
  const isInPlay = match.status === 'IN_PLAY';
  const isScheduled = match.status === 'TIMED' || match.status === 'SCHEDULED';

  // Info del partido
  card.querySelector('.match-info').textContent = i18n.t('MATCH') + ' ' + (match.matchday || '') + ' • ' + i18n.formatDate(match.utcDate);

  // Estado
  const statusEl = card.querySelector('.match-status');
  if (isFinished) {
    statusEl.textContent = i18n.translateStatusShort('FINISHED');
    statusEl.className = 'bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold';
  } else if (isInPlay) {
    statusEl.textContent = i18n.translateStatusShort('IN_PLAY');
    statusEl.className = 'bg-primary text-on-primary px-2 py-0.5 rounded text-[10px] font-bold animate-pulse';
  } else {
    statusEl.textContent = i18n.translateStatusShort('SCHEDULED');
    statusEl.className = 'bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold';
  }

  // Home team
  const homeEl = card.querySelector('.match-home');
  const homeName = i18n.translateTeam(match.homeTeam);
  homeEl.querySelector('.home-name').textContent = homeName || match.homeTeam?.tla || '—';
  homeEl.querySelector('.home-name').className = 'font-body-md text-body-md font-semibold home-name';
  const homeCrest = homeEl.querySelector('.home-crest');
  if (match.homeTeam?.crest) {
    homeCrest.src = match.homeTeam.crest;
    homeCrest.style.display = '';
  } else {
    homeCrest.style.display = 'none';
  }
  homeEl.querySelector('.home-score').textContent = homeScore !== null && homeScore !== undefined ? homeScore : '';

  // Away team
  const awayEl = card.querySelector('.match-away');
  const awayName = i18n.translateTeam(match.awayTeam);
  awayEl.querySelector('.away-name').textContent = awayName || match.awayTeam?.tla || '—';
  awayEl.querySelector('.away-name').className = 'font-body-md text-body-md away-name';
  const awayCrest = awayEl.querySelector('.away-crest');
  if (match.awayTeam?.crest) {
    awayCrest.src = match.awayTeam.crest;
    awayCrest.style.display = '';
  } else {
    awayCrest.style.display = 'none';
  }
  awayEl.querySelector('.away-score').textContent = awayScore !== null && awayScore !== undefined ? awayScore : '';

  // Winner highlighting: dim the loser
  if (isFinished && homeScore !== null && awayScore !== null) {
    const homeDiv = card.querySelector('.match-home');
    const awayDiv = card.querySelector('.match-away');
    homeDiv.classList.remove('opacity-60');
    awayDiv.classList.remove('opacity-60');
    if (homeScore > awayScore) {
      awayDiv.classList.add('opacity-60');
    } else if (awayScore > homeScore) {
      homeDiv.classList.add('opacity-60');
    } else {
      // Penalties: check winner
      if (match.score?.winner === 'HOME_TEAM') {
        awayDiv.classList.add('opacity-60');
      } else if (match.score?.winner === 'AWAY_TEAM') {
        homeDiv.classList.add('opacity-60');
      }
    }
  }
}

async function renderKnockout() {
  const container = document.getElementById('knockout-container');
  const loadingEl = document.getElementById('knockout-loading');
  const errorEl = document.getElementById('knockout-error');

  if (!container) return;

  try {
    // Fetch all match stages
    const [last16Data, quarterData, semiData, thirdData, finalData] = await Promise.all([
      getMatchesByStage('LAST_16'),
      getMatchesByStage('QUARTER_FINALS'),
      getMatchesByStage('SEMI_FINALS'),
      getMatchesByStage('THIRD_PLACE'),
      getMatchesByStage('FINAL')
    ]);

    const last16 = last16Data?.matches || [];
    const quarters = quarterData?.matches || [];
    const semis = semiData?.matches || [];
    const third = thirdData?.matches || [];
    const finals = finalData?.matches || [];

    // Map matches to bracket positions
    // Left R32 (0-3): first 4 LAST_16 matches (sorted by date)
    // Left R16 (4-5): first 2 QUARTER_FINALS matches
    // Center Final (8): FINAL
    // Right R16 (6-7): last 2 QUARTER_FINALS matches  
    // Right R32 (9-12): last 4 LAST_16 matches (sorted by date) -- but since we have 8 LAST_16 matches, we split 4 and 4

    // Sort matches by date for consistent ordering
    const sortedLast16 = [...last16].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
    const sortedQuarters = [...quarters].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

    // Split LAST_16: first 4 go left, last 4 go right
    const leftLast16 = sortedLast16.slice(0, 4);
    const rightLast16 = sortedLast16.slice(4, 8);

    // Split QUARTER_FINALS: first 2 go left, last 2 go right
    const leftQuarters = sortedQuarters.slice(0, 2);
    const rightQuarters = sortedQuarters.slice(2, 4);

    // Get the final match
    const finalMatch = finals[0] || null;

    // Create bracket match mapping:
    // data-match-id -> API match
    const bracketMatches = {
      0: leftLast16[0] || null,   // Left R32 match 1
      1: leftLast16[1] || null,   // Left R32 match 2
      2: leftLast16[2] || null,   // Left R32 match 3
      3: leftLast16[3] || null,   // Left R32 match 4
      4: leftQuarters[0] || null, // Left R16 match 1
      5: leftQuarters[1] || null, // Left R16 match 2
      6: rightQuarters[0] || null, // Right R16 match 1
      7: rightQuarters[1] || null, // Right R16 match 2
      8: finalMatch,               // Center Final
      9: rightLast16[0] || null,  // Right R32 match 1
      10: rightLast16[1] || null, // Right R32 match 2
      11: rightLast16[2] || null, // Right R32 match 3
      12: rightLast16[3] || null  // Right R32 match 4
    };

    // Fill each match card
    document.querySelectorAll('.match-card').forEach(card => {
      const matchId = card.dataset.matchId;
      const match = bracketMatches[matchId];
      if (match) {
        fillMatchCard(card, match);
      }
    });

    // Show container, hide loading
    container.classList.remove('hidden');
    loadingEl.classList.add('hidden');
    errorEl.classList.add('hidden');

  } catch (error) {
    console.error('Error renderKnockout:', error);
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
  }
}

// Auto-carga al entrar en la página
document.addEventListener('DOMContentLoaded', renderKnockout);