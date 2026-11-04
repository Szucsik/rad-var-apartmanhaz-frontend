import { RenderMode, ServerRoute } from '@angular/ssr';

// The HTML depends on the URL language and can change with a deployment; let CDNs/browsers revalidate it.
const htmlHeaders = { 'Cache-Control': 'no-cache' };

// Render every language URL on the server, so each gets its own HTML, title, canonical and JSON-LD.
// `/` is only a redirect entry point: its language depends on the visitor's saved/browser language,
// so rendering it on the server would not match the client. Keep it client-side.
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client,
    headers: htmlHeaders,
  },
  {
    path: 'hu',
    renderMode: RenderMode.Server,
    headers: htmlHeaders,
  },
  {
    path: 'pl',
    renderMode: RenderMode.Server,
    headers: htmlHeaders,
  },
  {
    path: 'en',
    renderMode: RenderMode.Server,
    headers: htmlHeaders,
  },
  {
    path: 'de',
    renderMode: RenderMode.Server,
    headers: htmlHeaders,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404,
    headers: htmlHeaders,
  },
];
