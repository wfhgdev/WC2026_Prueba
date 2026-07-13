// js/data.js
// Fallback data. Used only if the football-data.org request fails
// (offline, rate-limited, CORS-blocked, bad token, etc.) so the UI
// never renders empty/broken.

const MOCK_MATCHES = [
  {
    id: 'mock-1',
    stage: 'GROUP_STAGE',
    matchday: 2,
    group: 'Group A',
    status: 'live',
    minute: 72,
    venue: 'Estadio Azteca, Mexico City',
    homeTeam: { name: 'MEX', flag: 'https://flagcdn.com/mx.svg' },
    awayTeam: { name: 'CAN', flag: 'https://flagcdn.com/ca.svg' },
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: 'mock-2',
    stage: 'GROUP_STAGE',
    matchday: 1,
    group: 'Group B',
    status: 'scheduled',
    utcDate: null,
    venue: 'MetLife Stadium, NY/NJ',
    homeTeam: { name: 'USA', flag: 'https://flagcdn.com/us.svg' },
    awayTeam: { name: 'ENG', flag: 'https://flagcdn.com/gb-eng.svg' },
    homeScore: null,
    awayScore: null,
  },
  {
    id: 'mock-3',
    stage: 'GROUP_STAGE',
    matchday: 1,
    group: 'Group C',
    status: 'finished',
    venue: 'BMO Field, Toronto',
    homeTeam: { name: 'BRA', flag: 'https://flagcdn.com/br.svg' },
    awayTeam: { name: 'GER', flag: 'https://flagcdn.com/de.svg' },
    homeScore: 3,
    awayScore: 0,
  },
];

const MOCK_TOP_SCORERS = [
  { player: { name: 'K. Mbappé', nationality: 'France', crest: 'https://flagcdn.com/fr.svg' }, goals: 8 },
  { player: { name: 'V. Júnior', nationality: 'Brazil', crest: 'https://flagcdn.com/br.svg' }, goals: 6 },
  { player: { name: 'H. Kane', nationality: 'England', crest: 'https://flagcdn.com/gb-eng.svg' }, goals: 5 },
  { player: { name: 'J. Musiala', nationality: 'Germany', crest: 'https://flagcdn.com/de.svg' }, goals: 4 },
];
