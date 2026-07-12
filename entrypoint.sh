#!/bin/sh
# API_INTERNAL_URL is the one address SSR actually calls at runtime, but it's easy to forget
# to wire up outside docker-compose — log what SSR resolved to so a misconfigured deploy
# shows up immediately in `docker logs` instead of as a cryptic fetch failure on first request.
set -e

if [ -n "$API_INTERNAL_URL" ]; then
  echo "entrypoint: SSR will call the backend at $API_INTERNAL_URL"
else
  echo "entrypoint: API_INTERNAL_URL not set; SSR will fall back to the build-time NEXT_PUBLIC_API_URL"
fi

exec node server.js
