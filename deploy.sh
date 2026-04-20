#!/bin/bash
set -e

PROJECT_DIR="/home/ubuntu/web/hugopvigo/Blog"
APACHE_DIR="/var/www/html/dist"

echo "=== Deploy Astro Blog ==="

echo "[1/3] Building Astro project..."
cd "$PROJECT_DIR"
npm run build

echo "[2/3] Syncing dist/ to Apache DocumentRoot..."
rsync -av --delete "$PROJECT_DIR/dist/" "$APACHE_DIR/"

echo "[3/3] Fixing permissions..."
find "$APACHE_DIR" -type d -exec chmod 775 {} \;
find "$APACHE_DIR" -type f -exec chmod 664 {} \;
chown -R ubuntu:ubuntu "$APACHE_DIR"

echo "=== Deploy completo ==="
