#!/bin/bash

# Exit on error
set -e

# Build the Astro site
npx astro build

# Start Astro preview server in the background
npx astro preview --host &
PREVIEW_PID=$!

# Wait a few seconds to let the server start up
sleep 3

# Start cloudflared tunnel (replace astro-tunnel with your tunnel name)
cloudflared tunnel run astro-tunnel &

# Wait for the preview server to exit (keeps script running)
wait $PREVIEW_PID
