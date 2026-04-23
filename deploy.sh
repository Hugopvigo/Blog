#!/bin/bash
set -e

PROJECT_DIR="/home/ubuntu/web/hugopvigo/Blog"
APACHE_DIR="/var/www/html/dist"

echo "=== Deploy Astro Blog ==="

echo "[1/4] Installing dependencies..."
cd "$PROJECT_DIR"
npm install

echo "[2/4] Building Astro project..."
npm run build

echo "[3/4] Syncing dist/ to Apache DocumentRoot..."
rsync -av --delete "$PROJECT_DIR/dist/" "$APACHE_DIR/"

echo "[4/4] Fixing permissions..."
find "$APACHE_DIR" -type d -exec chmod 775 {} \;
find "$APACHE_DIR" -type f -exec chmod 664 {} \;
chown -R ubuntu:ubuntu "$APACHE_DIR"

echo "=== Deploy completo ==="
