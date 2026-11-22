"""Render the scrub film to PNG frames with headless Chrome.

  python3 render.py --w 1920 --h 1080 --fps 30 --out frames/landscape
  python3 render.py --w 1080 --h 2340 --fps 30 --out frames/portrait
  python3 render.py --w 1920 --h 1080 --times 0,2,4.7 --out stills   # spot checks

Needs: pip install playwright, and a Chrome binary (CHROME env var).
"""
import argparse, asyncio, base64, os, pathlib, shutil
from playwright.async_api import async_playwright

HERE = pathlib.Path(__file__).resolve().parent
CHROME = (os.environ.get('CHROME') or shutil.which('google-chrome') or shutil.which('chromium')
          or '/home/ubuntu/.local/bin/google-chrome')

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--w', type=int, default=1920)
    ap.add_argument('--h', type=int, default=1080)
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--duration', type=float, default=14)
    ap.add_argument('--times', default='')
    ap.add_argument('--out', default='frames')
    a = ap.parse_args()
    out = pathlib.Path(a.out); out.mkdir(parents=True, exist_ok=True)
    if a.times:
        times = [float(x) for x in a.times.split(',')]
    else:
        n = int(round(a.duration * a.fps))
        times = [i * (a.duration / (n - 1)) for i in range(n)]
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 1280, 'height': 800})
        await pg.goto(f'file://{HERE}/preview.html?w={a.w}&h={a.h}')
        await pg.wait_for_function('window.renderAt')
        await pg.evaluate('document.fonts.load(\'500 20px "JetBrains Mono"\')')
        for i, t in enumerate(times):
            url = await pg.evaluate('t => window.renderAt(t)', t)
            name = f't{t:05.2f}.png' if a.times else f'f{i:04d}.png'
            (out / name).write_bytes(base64.b64decode(url.split(',', 1)[1]))
            if i % 30 == 0: print(i, len(times), flush=True)
        await b.close()

asyncio.run(main())
