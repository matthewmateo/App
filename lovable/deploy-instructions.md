# Deployment Instructions for Self-Hosted Lovable

## Option 1: Deploy with Docker (Recommended)

1. Clone this repo to your server:
```bash
git clone <your-repo-url>
cd lovable
```

2. Start with Docker Compose:
```bash
docker-compose up -d
```

3. Access at: http://your-server-ip:3000

## Option 2: Manual Deployment

1. Install Node.js 18+ on your server

2. Run setup:
```bash
npm run setup
```

3. Start both services:
```bash
npm run dev
# Or for production:
npm run build
cd frontend && node build
```

## Option 3: Deploy to Cloud Platforms

### Vercel/Netlify (Frontend only)
```bash
cd frontend
npm run build
# Deploy the 'build' folder
```

### Railway/Render (Full stack)
- Connect your Git repo
- Set build command: `cd lovable && bash scripts/setup.sh && npm run build`
- Set start command: `npm run dev`
- Expose ports 3000 and 8090

## Option 4: Use Ngrok for Temporary Preview

From your current environment:
```bash
# Install ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Expose port 3000
ngrok http 3000
```
