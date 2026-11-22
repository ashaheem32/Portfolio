#!/usr/bin/env bash
# Encode the rendered PNG frames into scrub-friendly MP4s.
# -g 1 makes every frame a keyframe, so seeking to any scroll position is instant in every browser.
# Lower CRF = higher quality and bigger files (18 is visually lossless, 22 is near-source, 30 is the fast-start tier).
set -euo pipefail
cd "$(dirname "$0")"
OUT=../public/assets
enc() { # <frames dir> <width> <crf> <output>
  ffmpeg -y -loglevel error -framerate 30 -i "frames/$1/f%04d.png" \
    -vf "scale=$2:-2:flags=lanczos" -c:v libx264 -preset slow -crf "$3" \
    -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 -pix_fmt yuv420p \
    -movflags +faststart -an "$OUT/$4"
  ls -la "$OUT/$4"
}
enc landscape     1280 30 film-landscape-720p.mp4    # fast start
enc landscape     1920 21 film-landscape-1080p.mp4   # HD
enc landscape-qhd 2560 22 film-landscape-1440p.mp4   # high-DPI / large displays
enc portrait       720 30 film-portrait-720p.mp4     # fast start (phones)
enc portrait      1080 22 film-portrait-1080p.mp4    # HD (phones)
ffmpeg -y -loglevel error -i frames/landscape/f0000.png -q:v 3 "$OUT/film-poster.jpg"
echo ENCDONE
