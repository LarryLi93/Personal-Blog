# Curiosity Blog

基于 Next.js 14 + React + TypeScript + Tailwind CSS 构建的个人博客，支持 SSG 静态生成，SEO 友好。

## 架构

- **前端**：Next.js 14 (SSG 静态导出)
- **后端**：Python FastAPI + SQLite (浏览人数统计)

## 特性

- ✅ **静态站点生成 (SSG)** - 每篇文章都是独立的 HTML 文件，SEO 完美
- ✅ **自动 Sitemap** - 自动生成 sitemap.xml 供搜索引擎索引
- ✅ **元数据优化** - 每篇文章都有独立的 title、description、og:image
- ✅ **浏览人数统计** - Python 后端 + SQLite，支持用户去重
- ✅ **目录导航** - 文章右侧自动生成目录导航
- ✅ **分类筛选** - 首页支持按分类筛选文章
- ✅ **响应式设计** - 完美适配桌面和移动端

## 开发

### 1. 安装前端依赖

```bash
npm install
```

### 2. 启动后端服务

```bash
cd backend
# Windows
start.bat
# Linux/Mac
./start.sh
```

后端运行在 http://localhost:8000

### 3. 启动前端开发服务器

```bash
npm run dev
```

前端运行在 http://localhost:3000

## 部署

### 方案 1：同一服务器（推荐）

前后端部署在同一台服务器上：

```
服务器
├── Nginx (80/443端口)
│   ├── /         → 前端静态文件 (dist/)
│   └── /api/     → 后端服务 (127.0.0.1:8000)
├── 前端 (Next.js 构建输出)
└── 后端 (Python FastAPI)
```

**Nginx 配置：**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /var/www/blog/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端 API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**部署步骤：**

```bash
# 1. 构建前端
npm run build

# 2. 复制前端到服务器
scp -r dist/* user@server:/var/www/blog/

# 3. 复制后端到服务器
scp -r backend user@server:/var/www/blog/

# 4. 服务器上启动后端（使用 PM2 管理）
pm2 start "cd /var/www/blog/backend && python main.py" --name blog-backend
```

### 方案 2：分离部署

- **前端**：Vercel / Netlify / Cloudflare Pages
- **后端**：自己的服务器 / Railway / Render

**需要修改 `.env.local`：**

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### 方案 3：纯静态（去掉浏览人数）

如果不需要浏览人数功能，可以：

1. 删除 `backend/` 目录
2. 简化 `Hero.tsx` 去掉人数显示
3. 纯静态部署到任何 CDN

## 配置环境变量

创建 `.env.local`：

```bash
# 后端 API 地址（开发环境）
NEXT_PUBLIC_API_URL=http://localhost:8000

# 生产环境
# NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## 添加新文章

1. 在 `content/articles/` 创建 `.md` 文件
2. 添加 frontmatter 元数据：

```markdown
---
id: "1"
slug: "article-slug"
title: "文章标题"
excerpt: "文章摘要"
date: "2024-01-01"
author: "Larry Li"
category: "Learn"
coverImage: "/imgs/cover.png"
tags: "tag1, tag2, tag3"
---

文章内容...
```

## SEO 优化建议

1. **修改域名**：更新 `app/sitemap.ts` 和 `app/robots.ts` 中的域名
2. **添加 Google Analytics**：在 `app/layout.tsx` 中添加 GA 代码
3. **提交到搜索引擎**：
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)

## License

MIT
