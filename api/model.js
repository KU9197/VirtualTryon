export default async function handler(req, res) {
  const sku = req.query.sku;

  if (!sku) {
    return res.status(400).json({ error: 'Missing sku' });
  }

  try {
    const upstreamUrl =
      'https://glassesdbcached.jeeliz.com/sku/' + encodeURIComponent(String(sku));

    const upstreamRes = await fetch(upstreamUrl);

    if (!upstreamRes.ok) {
      return res.status(502).json({
        error: 'Invalid SKU or upstream fetch failed',
        sku
      });
    }

    const data = await upstreamRes.json();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=86400');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: 'Internal proxy error',
      detail: String(err)
    });
  }
}
