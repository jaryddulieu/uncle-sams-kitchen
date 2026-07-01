// Secure AI proxy for Uncle Sam's Kitchen.
// The browser calls /api/ai (no key). This server-side function adds the
// Anthropic API key from a private environment variable, so the key is
// NEVER visible in the public web page.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Use POST' } });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: { message: 'Server missing ANTHROPIC_API_KEY env var' } });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
}
