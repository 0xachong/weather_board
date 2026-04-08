// API Route: GET /api/data?slug=highest-temperature-in-nyc-on-april-8-2026
// Proxies a single Polymarket Gamma API event request (avoids CORS)
// Also supports: GET /api/data?city=nyc&date=2026-04-08

const GAMMA_API = "https://gamma-api.polymarket.com/events";

const MONTHS = ['january','february','march','april','may','june',
  'july','august','september','october','november','december'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  let slug = req.query.slug;

  // If city+date provided, build slug
  if (!slug && req.query.city && req.query.date) {
    const d = new Date(req.query.date + 'T00:00:00Z');
    const month = MONTHS[d.getUTCMonth()];
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    slug = `highest-temperature-in-${req.query.city}-on-${month}-${day}-${year}`;
  }

  if (!slug) {
    return res.status(400).json({ error: 'Missing slug or city+date params' });
  }

  try {
    const resp = await fetch(`${GAMMA_API}?slug=${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(10000)
    });

    if (!resp.ok) {
      return res.status(resp.status).json({ error: `Gamma API returned ${resp.status}` });
    }

    const data = await resp.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
