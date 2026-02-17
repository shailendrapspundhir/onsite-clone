#!/usr/bin/env bash
set -euo pipefail

echo "Run lint and typecheck for mobile app"
pnpm --filter ./apps/mobile-app run lint || true
pnpm --filter ./apps/mobile-app run typecheck || true
