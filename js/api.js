// js/api.js
// Thin wrapper around the football-data.org v4 API.
// All requests are read-only (GET) and require the X-Auth-Token header.

const worldCupApi = {
  /**
   * Low-level fetch helper. Throws on non-2xx so callers can fall back
   * to mock data instead of rendering a broken page.
   */
  async _get(path) {
    const response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
      headers: { 'X-Auth-Token': API_CONFIG.token },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // GET /competitions/WC/matches
  async getMatches() {
    const data = await this._get(`/competitions/${API_CONFIG.competitionCode}/matches`);
    return data.matches.map(mapMatch);
  },

  // GET /competitions/WC/matches?stage=LAST_16 etc, used by the knockout bracket
  async getMatchesByStage(stage) {
    const data = await this._get(
      `/competitions/${API_CONFIG.competitionCode}/matches?stage=${stage}`
    );
    return data.matches.map(mapMatch);
  },

  // GET /competitions/WC/standings
  async getStandings() {
    const data = await this._get(`/competitions/${API_CONFIG.competitionCode}/standings`);
    return data.standings; // array of { group, table: [...] }
  },

  // GET /competitions/WC/scorers
  async getTopScorers() {
    const data = await this._get(`/competitions/${API_CONFIG.competitionCode}/scorers`);
    return data.scorers;
  },
};

// Normalizes a football-data.org match object into the shape the UI uses,
// including the data-status value ("scheduled" | "live" | "finished")
// that js/matches.js filters on.
function mapMatch(match) {
  const statusMap = {
    SCHEDULED: 'scheduled',
    TIMED: 'scheduled',
    IN_PLAY: 'live',
    PAUSED: 'live',
    FINISHED: 'finished',
    SUSPENDED: 'live',
    POSTPONED: 'scheduled',
  };

  return {
    id: match.id,
    stage: match.stage,
    matchday: match.matchday,
    group: match.group,
    status: statusMap[match.status] || 'scheduled',
    utcDate: match.utcDate,
    venue: match.venue || 'Venue TBC',
    homeTeam: {
      name: match.homeTeam.shortName || match.homeTeam.name,
      flag: match.homeTeam.crest,
    },
    awayTeam: {
      name: match.awayTeam.shortName || match.awayTeam.name,
      flag: match.awayTeam.crest,
    },
    homeScore: match.score.fullTime.home,
    awayScore: match.score.fullTime.away,
    minute: match.minute || null,
  };
}
