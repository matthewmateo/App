#!/bin/bash

POCKETBASE_BIN="./pocketbase/pocketbase"

if [ ! -f "$POCKETBASE_BIN" ]; then
    echo "❌ PocketBase not found. Run 'npm run setup' first."
    exit 1
fi

echo "🚀 Starting PocketBase..."
cd pocketbase
./pocketbase serve --http=127.0.0.1:8090
