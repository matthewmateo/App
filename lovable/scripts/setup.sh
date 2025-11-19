#!/bin/bash

echo "🚀 Setting up Self-Hosted Lovable..."

# Check if running on Linux or macOS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "Detected OS: $MACHINE"

# Download PocketBase if not exists
POCKETBASE_DIR="./pocketbase"
POCKETBASE_BIN="$POCKETBASE_DIR/pocketbase"

if [ ! -f "$POCKETBASE_BIN" ]; then
    echo "📦 Downloading PocketBase..."
    mkdir -p "$POCKETBASE_DIR"

    if [ "$MACHINE" = "Linux" ]; then
        curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.21.3/pocketbase_0.21.3_linux_amd64.zip -o pb.zip
    elif [ "$MACHINE" = "Mac" ]; then
        curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.21.3/pocketbase_0.21.3_darwin_amd64.zip -o pb.zip
    else
        echo "❌ Unsupported OS. Please download PocketBase manually."
        exit 1
    fi

    unzip pb.zip -d "$POCKETBASE_DIR"
    rm pb.zip
    chmod +x "$POCKETBASE_BIN"
    echo "✅ PocketBase downloaded"
else
    echo "✅ PocketBase already installed"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "PocketBase admin UI at: http://localhost:8090/_/"
echo ""
echo "⚠️  Important: On first run, create an admin account at http://localhost:8090/_/"
