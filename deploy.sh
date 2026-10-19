#!/bin/bash
set -e

PROJECT_DIR="/home/ubuntu/web/hugopvigo/Blog"
APACHE_DIR="/var/www/html/dist"
PREV_DIR="$PROJECT_DIR/dist.prev"

fix_permissions() {
  find "$APACHE_DIR" -type d -exec chmod 755 {} \;
  find "$APACHE_DIR" -type f -exec chmod 644 {} \;
  chown -R ubuntu:ubuntu "$APACHE_DIR"
}

# Rollback: vuelve a servir la copia que había antes del último deploy.
if [ "$1" = "--rollback" ]; then
  if [ ! -d "$PREV_DIR" ]; then
    echo "ERROR: no hay copia anterior en $PREV_DIR" >&2
    exit 1
  fi
  echo "=== Rollback: restaurando el sitio anterior ==="
  rsync -a --delete "$PREV_DIR/" "$APACHE_DIR/"
  fix_permissions
  echo "=== Rollback completado ==="
  exit 0
fi

echo "=== Deploy Astro Blog ==="

echo "[1/5] Installing dependencies..."
cd "$PROJECT_DIR"
npm ci

echo "[2/5] Building Astro project..."
npm run build

echo "[3/5] Saving the site that is now live..."
rsync -a --delete "$APACHE_DIR/" "$PREV_DIR/"

echo "[4/5] Syncing dist/ to Apache DocumentRoot..."
rsync -av --delete "$PROJECT_DIR/dist/" "$APACHE_DIR/"

echo "[5/5] Fixing permissions..."
fix_permissions

echo "=== Deploy completo ==="
