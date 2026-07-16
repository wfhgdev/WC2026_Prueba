// ============================================
// Vercel Serverless Proxy — Football-Data.org
// ============================================
// Аналог proxy.php для хостинга без PHP (Vercel)
// ============================================

export default async function handler(req, res) {
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Auth-Token, Content-Type');

  // Ответ на preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Только GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Метод не разрешён' });
    return;
  }

  const endpoint = req.query.endpoint || '';

  if (!endpoint) {
    res.status(400).json({ error: 'Отсутствует параметр endpoint' });
    return;
  }

  const token = '244ff96cf28140c8b82341ecff5239b8';
  const url = 'https://api.football-data.org/v4' + endpoint;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': token,
        'User-Agent': 'WorldCup2026/1.0'
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Ошибка прокси:', error.message);
    res.status(500).json({ error: 'Ошибка соединения с API футбольных данных' });
  }
}