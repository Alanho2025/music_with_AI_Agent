#!/usr/bin/env bash
set -e

cd /home/ec2-user/music_with_AI_Agent/music-app
git pull origin main
npm ci
npm run build

sudo mkdir -p /var/www/kpop-frontend
sudo chown -R ec2-user:ec2-user /var/www/kpop-frontend
rm -rf /var/www/kpop-frontend/*
cp -r dist/* /var/www/kpop-frontend/

sudo nginx -t
sudo systemctl reload nginx
echo "Frontend deployed.
