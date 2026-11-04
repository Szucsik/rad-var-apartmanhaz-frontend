#!/usr/bin/env bash
# Builds the image locally and (re)starts it, so it can simply be rerun after source changes.
# Usage: ./docker-local.sh  (PORT overrides the published port, default 8080)
set -euo pipefail

cd "$(dirname "$0")"

IMAGE="rad-var-apartmanhaz:local-testing"
CONTAINER="rad-var-apartmanhaz-local"
PORT="${PORT:-8080}"

docker build --tag "$IMAGE" .

# Replace the previous container, otherwise the port stays taken by the old image.
docker rm --force "$CONTAINER" >/dev/null 2>&1 || true
docker run --detach --name "$CONTAINER" --restart unless-stopped --publish "$PORT:4000" \
  --env PORT=4000 \
  --env NG_ALLOWED_HOSTS="${NG_ALLOWED_HOSTS:-localhost,127.0.0.1}" \
  "$IMAGE"

echo "rad-var-apartmanhaz is running on http://localhost:$PORT/"
