#!/usr/bin/env bash
# Builds the multi-arch Docker image (amd64 + arm64) and pushes it to the GitHub Container Registry.
# Usage: ./docker-build-push.sh [extra docker buildx args]
# Log in first (`docker login ghcr.io`) or set GHCR_USER and GHCR_TOKEN (write:packages).
# Building the arm64 image on an amd64 host needs QEMU:
#   docker run --privileged --rm tonistiigi/binfmt --install arm64
set -euo pipefail

cd "$(dirname "$0")"

IMAGE="${IMAGE:-ghcr.io/szucsik/rad-var-apartmanhaz-frontend}"
TAG="${TAG:-latest}"
PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64}"
BUILDER="${BUILDER:-rva-multiarch}"
GIT_SHA="$(git rev-parse --short HEAD)"

if [ -n "${GHCR_TOKEN:-}" ]; then
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "${GHCR_USER:-szucsik}" --password-stdin
fi

# The default "docker" builder cannot build for other platforms.
if ! docker buildx inspect "$BUILDER" >/dev/null 2>&1; then
  docker buildx create --name "$BUILDER" --driver docker-container >/dev/null
fi

docker buildx build \
  --builder "$BUILDER" \
  --platform "$PLATFORMS" \
  --tag "$IMAGE:$TAG" \
  --tag "$IMAGE:sha-$GIT_SHA" \
  --push \
  "$@" .
