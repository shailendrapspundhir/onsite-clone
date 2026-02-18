#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/../.." && pwd)
cd "$ROOT"

echo "Running workspace type-check (tsc --noEmit)..."
pnpm -w exec tsc --noEmit

echo "Running lint across workspace..."
pnpm -w run lint

echo "Building packages..."
pnpm -w run build:packages

echo "Starting backend and web services (backends, web, mobile packager)..."
# Use concurrently to run backend and web dev servers and mobile packager in parallel
concurrently -k -n backends,web,mobile "pnpm dev:all" "pnpm dev:web"
