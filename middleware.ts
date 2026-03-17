import { rewrite } from '@vercel/functions'

const BOT_UA_RE =
  /(discordbot|twitterbot|slackbot|facebookexternalhit|whatsapp|telegrambot|linkedinbot|embedly|skypeuripreview)/i

export default function middleware(request: Request) {
  const url = new URL(request.url)
  if (!url.pathname.startsWith('/share/')) return

  const ua = request.headers.get('user-agent') ?? ''
  if (!BOT_UA_RE.test(ua)) return

  const character = url.pathname.slice('/share/'.length).split('/')[0] ?? ''
  const target = new URL(`/api/share/${character}`, url)
  target.search = url.search
  return rewrite(target)
}

export const config = {
  matcher: ['/share/:path*'],
}

