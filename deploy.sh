#!/bin/bash
set -e

PROJECT_DIR="/home/ubuntu/web/hugopvigo/Blog"
APACHE_DIR="/var/www/html/dist"
PREV_DIR="$PROJECT_DIR/dist.prev"
PREV2_DIR="$PROJECT_DIR/dist.prev.prev"

fix_permissions() {
  find "$APACHE_DIR" -type d -exec chmod 755 {} \;
  find "$APACHE_DIR" -type f -exec chmod 644 {} \;
  chown -R ubuntu:ubuntu "$APACHE_DIR"
}

# Devuelve 0 si el directorio existe y su contenido es distinto del que hay
# publicado ahora mismo.
is_different() {
  [ -d "$1" ] || return 1
  diff -rq "$APACHE_DIR" "$1" >/dev/null 2>&1 && return 1 || return 0
}

# Rollback: restaura la generación anterior más reciente que sea DISTINTA de
# lo que hay publicado. Se guardan dos generaciones para que un redespliegue
# de lo mismo (por ejemplo, repetir un deploy malo a toda prisa) no deje el
# rollback sin salida.
if [ "$1" = "--rollback" ]; then
  restored=""
  for gen in "$PREV_DIR" "$PREV2_DIR"; do
    if is_different "$gen"; then
      echo "=== Rollback: restaurando $gen ==="
      rsync -a --delete "$gen/" "$APACHE_DIR/"
      restored="$gen"
      break
    fi
  done
  if [ -z "$restored" ]; then
    echo "ERROR: no hay ninguna copia anterior distinta de lo publicado" >&2
    exit 1
  fi
  fix_permissions
  echo "=== Rollback completado (desde $restored) ==="
  exit 0
fi

echo "=== Deploy Astro Blog ==="

echo "[1/6] Installing dependencies..."
cd "$PROJECT_DIR"
npm ci

echo "[2/6] Building Astro project..."
npm run build

echo "[3/6] Saving the site that is live now..."
# Se rota la copia: la anterior pasa a la segunda generación.
if [ -d "$PREV_DIR" ]; then
  rm -rf "$PREV2_DIR"
  mv "$PREV_DIR" "$PREV2_DIR"
fi
rsync -a --delete "$APACHE_DIR/" "$PREV_DIR/"

echo "[4/6] Syncing dist/ to Apache DocumentRoot..."
rsync -av --delete "$PROJECT_DIR/dist/" "$APACHE_DIR/"

echo "[5/6] Fixing permissions..."
fix_permissions

echo "[6/6] Ready (rollback: bash deploy.sh --rollback)"
echo "=== Deploy completo ==="
