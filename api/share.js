function escapeHtmlAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  return `${proto}://${host}`
}

import { decompressFromEncodedURIComponent } from 'lz-string'

export default function handler(req, res) {
  const character = typeof req.query.character === 'string' ? req.query.character : ''
  let n = typeof req.query.n === 'string' ? req.query.n.trim() : ''

  // If n is missing, try to extract name from compressed deck code (d param)
  if (!n && typeof req.query.d === 'string' && req.query.d.length > 0) {
    try {
      const json = decompressFromEncodedURIComponent(req.query.d)
      if (json) {
        const parsed = JSON.parse(json)
        if (typeof parsed === 'object' && parsed !== null && 'name' in parsed && typeof parsed.name === 'string') {
          n = parsed.name.trim()
        }
      }
    } catch {}
  }

  const title = n || `Custom ${character || 'deck'}`
  const description = 'Shared deck for Slay the Spire 2 deck builder.'

  const origin = getOrigin(req)
  const shareUrl = new URL(`${origin}/share/${encodeURIComponent(character || '')}`)
  for (const [k, v] of Object.entries(req.query)) {
    if (typeof v === 'string') shareUrl.searchParams.set(k, v)
  }

  const imageUrl = `${origin}/favicon.svg`

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtmlAttr(title)}</title>
    <meta name="description" content="${escapeHtmlAttr(description)}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtmlAttr(title)}" />
    <meta property="og:description" content="${escapeHtmlAttr(description)}" />
    <meta property="og:url" content="${escapeHtmlAttr(shareUrl.toString())}" />
    <meta property="og:image" content="${escapeHtmlAttr(imageUrl)}" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtmlAttr(title)}" />
    <meta name="twitter:description" content="${escapeHtmlAttr(description)}" />
    <meta name="twitter:image" content="${escapeHtmlAttr(imageUrl)}" />
  </head>
  <body></body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  res.status(200).send(html)
}

