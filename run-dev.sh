#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

trap 'kill 0' SIGINT SIGTERM EXIT

echo "Starting backend (port 5000)..."
(cd "$ROOT_DIR/backend" && node server.js) &

echo "Starting frontend (port 3000)..."
(cd "$ROOT_DIR/frontend" && pnpm build && pnpm start) &

wait
