import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const directory = new URL('../dist/', import.meta.url);
const root = decodeURIComponent(directory.pathname);
for (const subpath of ['src','styles.css','styles-boutique.css']) {
  await rm(join(root, subpath), { recursive: true, force: true });
}
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer">
<meta name="theme-color" content="#F3F0E8"><title>Private Booking Demo · The Launch Era</title>
<style>
:root{font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#292a25;background:#f3f0e8}
*{box-sizing:border-box}body{min-height:100svh;display:grid;place-items:center;margin:0;padding:24px}
main{max-width:530px;padding:clamp(28px,6vw,54px);background:#faf8f3;border:1px solid #deded1;border-radius:27px;box-shadow:0 14px 50px #34452c16}
p{font-size:15px;line-height:1.7}small{letter-spacing:.14em;font-weight:700;color:#596749}h1{font-family:Georgia,serif;font-size:clamp(32px,6vw,47px);line-height:1.12;font-weight:400;letter-spacing:-.04em}
a{display:inline-flex;padding:13px 21px;border-radius:99px;background:#596749;color:#fff;text-decoration:none;font-weight:700;font-size:14px}
a:hover,a:focus-visible{background:#45543a}footer{font-size:12px;color:#666e5e;margin-top:35px}
</style></head><body><main><small>THE LAUNCH ERA</small><h1>Your booking preview is by invitation.</h1>
<p>Already requested a demo? Open the private link we sent to your email and complete any verification requested there.</p>
<p>This page does not accept bookings or collect personal details.</p>
<a href="https://thelaunchera.com/">Explore The Launch Era ↗</a>
<footer>Booking Automation · Interactive product demonstration</footer></main></body></html>`;
await writeFile(join(root, 'index.html'),html);
console.log('Public GitHub Pages now displays an invitation notice only; approved demo UI remains behind the access gate.');
