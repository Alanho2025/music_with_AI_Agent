#!/usr/bin/env bash
set -e

cd /home/ec2-user/music_with_AI_Agent/kpop-backend
git pull origin main

if git diff --name-only HEAD@{1} HEAD | grep -E "package-lock.json|package.json" >/dev/null 2>&1; then
  npm ci --omit=dev
fi

pm2 restart kpop-backend
pm2 status

