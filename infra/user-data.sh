#!/bin/bash
set -euo pipefail
exec > >(tee /var/log/user-data.log) 2>&1

echo "=== LumiLivro provisioning started at $(date) ==="

export DEBIAN_FRONTEND=noninteractive

# --- System update ---
echo ">>> Updating system packages..."
apt-get update
apt-get upgrade -y

# --- PostgreSQL ---
echo ">>> Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql
sudo -u postgres psql -c "CREATE USER lumilivro WITH PASSWORD '${db_password}';"
sudo -u postgres psql -c "CREATE DATABASE lumilivro OWNER lumilivro;"

# --- Node.js 20 ---
echo ">>> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# --- pnpm & PM2 ---
echo ">>> Installing pnpm and PM2..."
npm install -g pnpm pm2

# --- Caddy ---
echo ">>> Installing Caddy..."
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update
apt-get install -y caddy

# --- Clone repository ---
echo ">>> Cloning repository..."
apt-get install -y git
sudo -u ubuntu git clone ${github_repo} /home/ubuntu/app

# --- Environment file ---
echo ">>> Writing .env file..."
cat > /home/ubuntu/app/.env << 'ENVEOF'
DATABASE_URL="postgresql://lumilivro:${db_password}@localhost:5432/lumilivro?schema=public"
STRIPE_SECRET_KEY="${stripe_secret_key}"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${stripe_publishable_key}"
STRIPE_WEBHOOK_SECRET="${stripe_webhook_secret}"
RESEND_API_KEY="${resend_api_key}"
EMAIL_FROM="${email_from}"
ADMIN_PASSWORD="${admin_password}"
NEXT_PUBLIC_APP_URL="https://${domain}"
NEXT_PUBLIC_STRIPE_LINK_BASIC="${stripe_link_basic}"
NEXT_PUBLIC_STRIPE_LINK_PREMIUM="${stripe_link_premium}"
ENVEOF
chown ubuntu:ubuntu /home/ubuntu/app/.env

# --- Build application ---
echo ">>> Installing dependencies and building..."
su - ubuntu -c "cd /home/ubuntu/app && pnpm install --frozen-lockfile"
su - ubuntu -c "cd /home/ubuntu/app && pnpm exec prisma generate"
su - ubuntu -c "cd /home/ubuntu/app && pnpm exec prisma db push"
su - ubuntu -c "cd /home/ubuntu/app && pnpm build"

# --- PM2 ---
echo ">>> Starting application with PM2..."
su - ubuntu -c "cd /home/ubuntu/app && pm2 start pnpm --name lumilivro -- start"
su - ubuntu -c "pm2 save"
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# --- Caddy ---
echo ">>> Configuring Caddy..."
cat > /etc/caddy/Caddyfile << 'CADDYEOF'
${domain} {
    reverse_proxy localhost:3000
}
CADDYEOF
systemctl restart caddy
systemctl enable caddy

echo "=== LumiLivro provisioning complete at $(date) ==="
echo ">>> Point your DNS A record to this server's IP, then Caddy will automatically obtain a TLS certificate."
