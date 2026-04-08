// Vercel Cron handler: GET /api/update
// Triggered daily at 14:00 UTC by vercel.json cron config
// Simply warms the /api/data cache by calling it

export default async function handler(req, res) {
  const host = req.headers.host || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';

  try {
    const resp = await fetch(`${protocol}://${host}/api/data`, {
      headers: { 'User-Agent': 'Mozilla/5.0 CronJob' }
    });
    const data = await resp.json();
    return res.status(200).json({
      ok: true,
      cities: data.cities?.length || 0,
      dates: data.dates?.length || 0
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
