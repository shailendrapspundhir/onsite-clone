#!/bin/bash
set -e
pnpm dev:all &
BACKEND_PID=$!
# Wait for services to be up (10 seconds)
sleep 10
# Health checks
echo "Checking backend health..."
for port in 3001 3002 3003; do
  until curl -s http://localhost:$port/graphql -H "Content-Type: application/json" -d '{"query":"{ health { status } }"}' | grep -q '"status":"ok"'; do
    echo "Waiting for backend on port $port..."
    sleep 2
done
done
echo "All backends healthy."
