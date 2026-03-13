#!/bin/bash
# Run this script once on a fresh Ubuntu 22.04 DigitalOcean Droplet as root.
# Usage: bash setup-server.sh yourdomain.com

set -euo pipefail

DOMAIN="${1:?Usage: $0 <yourdomain.com>}"
APP_DIR="/var/www/chatbot-platform"
SECRETS_DIR="/var/www/secrets"

echo "==> Updating system packages..."
apt-get update -y && apt-get upgrade -y

echo "==> Installing Docker..."
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker
echo "==> Docker $(docker --version) installed."

echo "==> Installing Git..."
apt-get install -y git

echo "==> Configuring UFW firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP  (Nginx / ACME challenge)
ufw allow 443/tcp   # HTTPS (Nginx)
ufw --force enable
ufw status

echo "==> Creating app directory: $APP_DIR"
mkdir -p "$APP_DIR"

echo "==> Creating secrets directory: $SECRETS_DIR"
mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"

echo "==> Creating SSL directory..."
mkdir -p "$APP_DIR/docker/ssl"
chmod 700 "$APP_DIR/docker/ssl"

echo ""
echo "============================================================"
echo "  Server setup complete!"
echo "============================================================"
echo ""
echo "Next steps:"
echo "  1. Clone your repo:"
echo "     git clone <your-repo-url> $APP_DIR"
echo ""
echo "  2. Paste your Cloudflare Origin Certificate files:"
echo "     $APP_DIR/docker/ssl/fullchain.pem   (Certificate)"
echo "     $APP_DIR/docker/ssl/privkey.pem      (Private Key)"
echo ""
echo "  3. Update nginx server_name:"
echo "     sed -i 's/yourdomain.com/$DOMAIN/g' $APP_DIR/docker/nginx.conf"
echo ""
echo "  4. Create the production .env file:"
echo "     nano $SECRETS_DIR/.env"
echo "     (Use .env.example as your template)"
echo ""
echo "  5. First deploy:"
echo "     cd $APP_DIR"
echo "     cp $SECRETS_DIR/.env apps/web/.env"
echo "     docker compose -f docker/docker-compose.yml up -d --build"
echo "     docker exec chatbot-app npx prisma migrate deploy"
echo ""
