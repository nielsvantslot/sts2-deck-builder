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



import lzString from 'lz-string'
const { decompressFromEncodedURIComponent } = lzString


export default function handler(req, res) {
  let errorTitle = null
  try {
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
      } catch (err) {
        errorTitle = 'Invalid or corrupt deck code'
      }
    }

    let title = n || `Custom ${character || 'deck'}`
    let description = 'Shared deck for Slay the Spire 2 deck builder.'
    if (errorTitle) {
      title = errorTitle
      description = 'There was a problem decoding this deck.'
    }

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
  } catch (err) {
    // Always return valid HTML with Open Graph tags, even on error
    const fallbackTitle = 'Deck unavailable'
    const fallbackDescription = 'There was an error generating this deck embed.'
    const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtmlAttr(fallbackTitle)}</title>
    <meta name="description" content="${escapeHtmlAttr(fallbackDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtmlAttr(fallbackTitle)}" />
    <meta property="og:description" content="${escapeHtmlAttr(fallbackDescription)}" />
    <meta property="og:url" content="" />
    <meta property="og:image" content="/favicon.svg" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtmlAttr(fallbackTitle)}" />
    <meta name="twitter:description" content="${escapeHtmlAttr(fallbackDescription)}" />
    <meta name="twitter:image" content="/favicon.svg" />
  </head>
  <body></body>
</html>`
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(200).send(fallbackHtml)
  }
}

