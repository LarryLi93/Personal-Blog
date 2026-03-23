#!/bin/bash

set -e

echo "=== 开始更新 Personal Blog ==="

# 进入项目目录
cd /www/wwwroot/Personal-Blog

# 拉取最新代码（可选，如果不是 git 仓库请注释掉）
if [ -d .git ]; then
    echo "[1/5] 拉取最新代码..."
    git pull
fi

# 停止并删除旧容器
echo "[2/5] 停止旧容器..."
docker-compose down

# 重新构建镜像（--build 会重新构建，--no-cache 完全重新构建）
echo "[3/5] 重新构建镜像..."
docker-compose build --no-cache

# 启动新容器
echo "[4/5] 启动新容器..."
docker-compose up -d

# 清空系统 Nginx 缓存
echo "[5/5] 清空 Nginx 缓存..."
if [ -d /www/server/nginx/proxy_cache_dir ]; then
    rm -rf /www/server/nginx/proxy_cache_dir/*
    echo "    系统 Nginx 缓存已清空"
fi
if [ -d /www/wwwroot/www.islarryli.com/proxy_cache_dir ]; then
    rm -rf /www/wwwroot/www.islarryli.com/proxy_cache_dir/*
    echo "    站点 Nginx 缓存已清空"
fi
# 重载系统 Nginx
if [ -f /www/server/nginx/sbin/nginx ]; then
    /www/server/nginx/sbin/nginx -s reload 2>/dev/null && echo "    系统 Nginx 已重载"
elif [ -f /etc/init.d/nginx ]; then
    /etc/init.d/nginx reload 2>/dev/null && echo "    系统 Nginx 已重载"
fi

# 等待启动
sleep 3

# 检查状态
echo ""
echo "=== 容器状态 ==="
docker-compose ps

echo ""
echo "=== 更新完成 ==="
echo "前端访问: http://你的IP:81"
echo "后端访问: http://你的IP:8010"
