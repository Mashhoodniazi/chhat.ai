# ChatBot AI — Multi-Tenant AI Chatbot SaaS Platform

A production-grade SaaS platform where businesses upload their knowledge base and get an embeddable AI chatbot powered by GPT-4o and pgvector RAG.

## Architecture

| Layer | Technology |
|---|---|
| Frontend + API | Next.js 14 (App Router) |
| AI | OpenAI GPT-4o |
| Vector Search | pgvector (PostgreSQL extension) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (JWT) |
| File Storage | DigitalOcean Spaces (S3-compatible) |
| Containerization | Docker + Docker Compose |
| Reverse Proxy | Nginx (SSL + rate limiting) |
| CI/CD | GitHub Actions → DigitalOcean Droplet |

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- PostgreSQL with pgvector extension
- OpenAI API key
- DigitalOcean Spaces bucket (or any S3-compatible storage)

### 1. Enable pgvector on your PostgreSQL database

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Configure environment

```bash
cp .env.example apps/web/.env
# Edit apps/web/.env with your values
```

### 3. Install dependencies

```bash
cd apps/web
npm install --legacy-peer-deps
```

### 4. Run database migrations

```bash
cd apps/web
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## DigitalOcean Production Deployment

### Resources Required
- **Droplet**: Ubuntu 22.04, min 2GB RAM (~$18/mo)
- **Managed PostgreSQL**: ~$15/mo (enable pgvector extension)
- **Spaces**: Object storage ~$5/mo

### Server Setup

```bash
# On your DigitalOcean Droplet
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git

# Clone repo
git clone https://github.com/youruser/chatbot-platform.git /var/www/chatbot-platform
cd /var/www/chatbot-platform

# Store secrets safely (not in repo)
mkdir -p /var/www/secrets
nano /var/www/secrets/.env  # Add your production .env values

# Copy env for first run
cp /var/www/secrets/.env apps/web/.env
```

### SSL with Let's Encrypt

```bash
sudo apt install -y certbot
sudo certbot certonly --standalone -d yourdomain.com

# SSL certs will be at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem

# Update docker/nginx.conf ssl_certificate paths to point here
# Or symlink to docker/ssl/
mkdir -p docker/ssl
ln -s /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/ssl/fullchain.pem
ln -s /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/ssl/privkey.pem
```

### First Deploy

```bash
cd /var/www/chatbot-platform
docker compose -f docker/docker-compose.yml build
docker compose -f docker/docker-compose.yml up -d

# Run migrations
docker exec chatbot-app npx prisma migrate deploy
```

### GitHub Actions CI/CD

Add these secrets to your GitHub repository (Settings → Secrets):

| Secret | Value |
|---|---|
| `DO_HOST` | Your droplet IP |
| `DO_USER` | `root` or your SSH user |
| `DO_SSH_KEY` | Private SSH key (add public key to droplet) |

Every push to `main` automatically deploys.

### Enable pgvector on DigitalOcean Managed PostgreSQL

In the DigitalOcean control panel:
1. Navigate to your database cluster
2. Go to Settings → Extensions
3. Enable `pgvector`

Or connect and run:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Environment Variables

```bash
# App
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:25060/chatbot?sslmode=require

# OpenAI
OPENAI_API_KEY=sk-...

# DigitalOcean Spaces
DO_SPACES_KEY=your-access-key
DO_SPACES_SECRET=your-secret-key
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_CDN_URL=https://your-bucket.nyc3.cdn.digitaloceanspaces.com
```

## How the RAG Pipeline Works

1. **Upload** — User uploads PDF or TXT via the dashboard
2. **Store** — Raw file saved to DigitalOcean Spaces
3. **Extract** — Text extracted (pdf-parse for PDFs)
4. **Chunk** — Text split into ~500 word chunks with 50 word overlap
5. **Embed** — Each chunk embedded via `text-embedding-3-small` (1536 dims)
6. **Store vectors** — Embeddings stored in `DocumentChunk` table using pgvector
7. **Query** — User message embedded, top-5 similar chunks retrieved via cosine similarity
8. **Answer** — GPT-4o answers using only the retrieved context, streamed back

## Embedding the Chatbot

After creating a bot and uploading documents, copy the embed snippet from the dashboard:

```html
<script>
  window.ChatbotConfig = {
    botId: "YOUR_BOT_ID",
    apiKey: "YOUR_EMBED_API_KEY"
  };
</script>
<script src="https://yourdomain.com/embed.js" async></script>
```

Paste this before `</body>` on any website. A chat bubble appears in the bottom-right corner.

## Project Structure

```
/
├── apps/web/                    # Next.js application
│   ├── app/
│   │   ├── (auth)/             # Login / signup pages
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # Shared UI components
│   │   └── dashboard/          # Dashboard-specific components
│   ├── lib/                    # Core utilities
│   │   ├── auth.ts             # NextAuth config
│   │   ├── prisma.ts           # DB client
│   │   ├── openai.ts           # OpenAI client
│   │   ├── embeddings.ts       # Chunking + embedding
│   │   ├── pgvector.ts         # Vector similarity search
│   │   └── s3.ts               # DigitalOcean Spaces
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── public/
│       └── embed.js            # The embeddable chat widget
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── init-db.sql
└── .github/
    └── workflows/
        └── deploy.yml
```

## Security Notes

- **Tenant isolation**: All DB queries filter by `userId` — users can never access other tenants' bots
- **pgvector isolation**: `DocumentChunk` queries always filter by `botId`
- **Chat endpoint**: Public but validates `embedApiKey` on every request; rate limited at both app and Nginx level
- **CORS**: Chat endpoint allows `*` origin (required for embed on external sites)
- **Passwords**: bcrypt with 12 rounds
- **Migrations**: Always use `prisma migrate deploy` in production, never `db push`
