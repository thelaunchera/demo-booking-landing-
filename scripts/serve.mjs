import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon'};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const path = decodeURIComponent(url.pathname);
    const destination = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!destination.startsWith(root + sep) || destination.includes(sep + '.git' + sep)) {
      res.writeHead(403).end('Forbidden'); return;
    }
    const file = await stat(destination);
    if (!file.isFile()) { res.writeHead(404).end('Not found'); return; }
    const body = await readFile(destination);
    res.writeHead(200, {'content-type':types[extname(destination)] || 'application/octet-stream','cache-control':extname(destination)==='.html'?'no-cache':'public, max-age=3600','x-content-type-options':'nosniff'});
    res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
});
server.listen(port, '0.0.0.0', () => console.log('Booking demo ready on port ' + port));
