#!/usr/bin/env bash
# Encode the rendered PNG frames (3840x2160 landscape, 1440x3120 portrait) into MP4s.
# Scrub files: -g 1 makes every frame a keyframe, so seeking to any scroll position is instant.
# That is also why they are large; a longer GOP roughly doubles seek time for ~25% less size.
# Lower CRF = higher quality and bigger files.
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
enc landscape 1280 28 film-landscape-720p-v2.mp4    # quick first paint
enc landscape 1920 22 film-landscape-1080p-v2.mp4   # HD
enc landscape 2560 23 film-landscape-1440p-v2.mp4   # QHD
enc landscape 3840 26 film-landscape-2160p-v2.mp4   # 4K / Retina
enc portrait   720 28 film-portrait-720p-v2.mp4     # quick first paint (phones)
enc portrait  1080 22 film-portrait-1080p-v2.mp4    # phones
enc portrait  1440 24 film-portrait-1440p-v2.mp4    # tablets
ffmpeg -y -loglevel error -i frames/landscape/f0000.png -vf scale=1920:-2:flags=lanczos -q:v 3 "$OUT/film-poster.jpg"

echo ENCDONE
