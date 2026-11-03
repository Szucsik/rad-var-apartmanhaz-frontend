#!/usr/bin/env bash
# Builds the project into dist/rad-var-apartmanhaz.
# Usage: ./build.sh [extra ng build args, e.g. --configuration development]
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  npm ci
fi

npx ng build "$@"
