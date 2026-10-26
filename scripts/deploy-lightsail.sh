#!/bin/bash
set -e

echo "=========================================================="
echo "  SNIPER Loan Management System — AWS Lightsail Deployer  "
echo "=========================================================="

# 1. Setup 2GB Swap Memory (Prevents Out-Of-Memory errors on 512MB/1GB Lightsail tiers)
if [ ! -f /swapfile ]; then
    echo ">> [1/6] Allocating 2GB Swap space..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo ">> Swap created successfully."
else
    echo ">> Swap already configured."
fi

# 2. Update System & Install Base Packages
echo ">> [2/6] Updating system packages and installing dependencies..."
sudo apt-get update -y
sudo apt-get install -y curl git ufw nginx

# 3. Install Node.js 22.x LTS & PM2
if ! command -v node &> /dev/null; then
    echo ">> [3/6] Installing Node.js 22 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
sudo npm install -g pm2 tsx

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 4. Clone or Pull Application Repository
APP_DIR="/var/www/loan-management"
REPO_URL="https://github.com/Satyacoder-31/loan-management-.git"

echo ">> [4/6] Setting up project directory at $APP_DIR..."
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

if [ ! -d "$APP_DIR/.git" ]; then
    echo ">> Cloning repository..."
    git clone $REPO_URL $APP_DIR
else
    echo ">> Pulling latest changes..."
    cd $APP_DIR
    git pull origin main
fi

cd $APP_DIR

# 5. Check .env file
if [ ! -f "$APP_DIR/.env" ]; then
    echo ">> NOTE: No .env file detected in $APP_DIR."
    echo ">> Please paste your production .env into $APP_DIR/.env"
fi

# 6. Install Dependencies & Build
echo ">> [5/6] Installing dependencies..."
npm install

echo ">> Building Client Frontend..."
npm run build -w client

# 7. Configure Nginx
echo ">> [6/6] Configuring Nginx reverse proxy..."
sudo cp $APP_DIR/scripts/nginx-sniper.conf /etc/nginx/sites-available/sniper
sudo ln -sf /etc/nginx/sites-available/sniper /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 8. Start Backend Service with PM2
echo ">> Starting Backend API with PM2..."
pm2 delete sniper-api 2>/dev/null || true
pm2 start "npm run start -w server" --name "sniper-api"
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER | sudo bash 2>/dev/null || true

# 9. Firewall rules in Ubuntu
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo "=========================================================="
echo "  DEPLOYMENT COMPLETE!                                    "
echo "  Your application is running on port 80.                 "
echo "  Point your browser to your Lightsail Static IP.        "
echo "=========================================================="
