#!/usr/bin/env bash
# Builds the Docker image and pushes it to the GitHub Container Registry (ghcr.io).
# Usage: ./docker-build-push.sh [extra docker build args]
# Log in first (`docker login ghcr.io`) or set GHCR_USER and GHCR_TOKEN (write:packages).
set -euo pipefail

cd "$(dirname "$0")"

IMAGE="${IMAGE:-ghcr.io/szucsik/rad-var-apartmanhaz-frontend}"
TAG="${TAG:-latest}"
GIT_SHA="$(git rev-parse --short HEAD)"

if [ -n "${GHCR_TOKEN:-}" ]; then
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "${GHCR_USER:-szucsik}" --password-stdin
fi

docker build -t "$IMAGE:$TAG" -t "$IMAGE:sha-$GIT_SHA" "$@" .

docker push "$IMAGE:$TAG"
docker push "$IMAGE:sha-$GIT_SHA"
