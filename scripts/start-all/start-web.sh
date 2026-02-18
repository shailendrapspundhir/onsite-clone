#!/bin/bash
set -e
pnpm dev:web &
WEB_PID=$!
sleep 5
