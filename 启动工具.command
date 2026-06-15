#!/bin/bash
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found."
  echo "For local use, install Node.js first:"
  echo "https://nodejs.org/"
  echo
  echo "Recommended for normal users: deploy this folder to a website and open the hosted URL in Chrome."
  read -r -p "Press Enter to close..."
  exit 1
fi

if curl -fsS --max-time 1 "http://localhost:4173/" >/dev/null 2>&1; then
  echo "Local server is already running."
  echo "Opening http://localhost:4173 ..."
  open "http://localhost:4173"
  read -r -p "Press Enter to close..."
  exit 0
fi

echo "Starting local server..."
echo "Open URL: http://localhost:4173"
(sleep 1 && open "http://localhost:4173") &
node server.mjs

echo
echo "Local server stopped."
read -r -p "Press Enter to close..."
