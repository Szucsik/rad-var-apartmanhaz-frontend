#!/usr/bin/env bash
# Runs the project with the Angular dev server (http://localhost:4200 by default).
# Usage: ./run.sh [extra ng serve args, e.g. --port 4300 --open]
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  npm ci
fi

npx ng serve "$@"
