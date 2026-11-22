// Cloudflare Pages Function: same-origin Firebase Auth helper reverse proxy.
// Cloudflare Pages routes this to /__/auth/* and /__/firebase/init.json.
const firebaseOrigin = 'https://musaf-ldks-fsh-2026.firebaseapp.com';
export async function onRequest({request}) {
  const incoming = new URL(request.url);
  if (!(incoming.pathname.startsWith('/__/auth/') || incoming.pathname === '/__/firebase/init.json')) {
    return new Response('Not found', {status:404});
  }
  const upstream = new URL(incoming.pathname + incoming.search, firebaseOrigin);
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('cookie'); // never forward app session cookies to Firebase hosting
  const opts = {method:request.method, headers, redirect:'manual'};
  if (!['GET','HEAD'].includes(request.method)) opts.body=request.body;
  const result = await fetch(upstream.toString(), opts);
  const resultHeaders = new Headers(result.headers);
  resultHeaders.delete('set-cookie');
  const location = resultHeaders.get('location');
  if (location && location.startsWith(firebaseOrigin + '/__/')) {
    resultHeaders.set('location', location.replace(firebaseOrigin, incoming.origin));
  }
  return new Response(result.body, {status:result.status, headers:resultHeaders});
}
