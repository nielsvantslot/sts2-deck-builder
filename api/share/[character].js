import { CHARACTER_MAP } from '../../src/lib/constants.js'
import { decodeDeck } from '../../src/lib/deck-code.js'

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

export default function handler(req, res) {
  const character = String(req.query.character ?? '')
  const n = typeof req.query.n === 'string' ? req.query.n.trim() : ''
  const d = typeof req.query.d === 'string' ? req.query.d : ''

  const charInfo = CHARACTER_MAP[character]
  const charName = charInfo?.name ?? 'Character'

  const title = n || `Custom ${charName} deck`

  let description = 'Shared deck for Slay the Spire 2 deck builder.'
  if (d) {
    const decoded = decodeDeck(d)
    if (decoded?.length) {
      const total = decoded.reduce((sum, e) => sum + (e.count || 0), 0)
      const unique = decoded.length
      description = `${total} cards (${unique} unique). Open to view and edit.`
    }
  }

  const origin = getOrigin(req)
  const urlPath = `/share/${encodeURIComponent(character)}`
  const url = `${origin}${urlPath}${req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`

  // Nice-to-have character image; fallback to favicon.
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
    <meta property="og:url" content="${escapeHtmlAttr(url)}" />
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

