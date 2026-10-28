#!/bin/sh
# encode.sh — 把 PNG 序列 + WAV 合成 MP4
# 用法: FPS=60 CRF=18 sh tools/encode.sh frames out/pelican.mp4 audio/mix.wav
set -e
FRAMES=${1:-frames}
OUT=${2:-out/pelican.mp4}
AUDIO=${3:-}
FPS=${FPS:-60}
CRF=${CRF:-18}
mkdir -p "$(dirname "$OUT")"
if [ -n "$AUDIO" ] && [ -f "$AUDIO" ]; then
  ffmpeg -y -framerate "$FPS" -i "$FRAMES/%06d.png" -i "$AUDIO" \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -movflags +faststart \
    -c:a aac -b:a 192k -shortest "$OUT"
else
  ffmpeg -y -framerate "$FPS" -i "$FRAMES/%06d.png" \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -movflags +faststart "$OUT"
fi
echo "→ $OUT"
