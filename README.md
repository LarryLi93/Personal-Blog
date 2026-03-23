# LarryLilog

基于 Next.js 14 + React + TypeScript + Tailwind CSS 构建的个人博客，支持 SSG 静态生成，SEO 友好。

## 架构

- **前端**：Next.js 14 (SSG 静态导出) + Nginx
- **后端**：Python FastAPI + SQLite (浏览人数统计)

## 特性

- ✅ **静态站点生成 (SSG)** - 每篇文章都是独立的 HTML 文件，SEO 完美
- ✅ **自动 Sitemap** - 自动生成 sitemap.xml 供搜索引擎索引
- ✅ **元数据优化** - 每篇文章都有独立的 title、description、og:image
- ✅ **浏览人数统计** - Python 后端 + SQLite，支持用户去重
- ✅ **目录导航** - 文章右侧自动生成目录导航
- ✅ **分类筛选** - 首页支持按分类筛选文章
- ✅ **响应式设计** - 完美适配桌面和移动端
- ✅ **Docker 一键部署** - 使用 Docker Compose 快速部署

## 快速开始（Docker 一键部署）

### 1. 克隆项目

```bash
git clone https://github.com/LarryLi93/Personal-Blog.git
cd Personal-Blog
```

### 2. 使用 Docker Compose 启动

```bash
docker-compose up -d
```

等待构建完成后，访问 <http://localhost>

### 3. 停止服务

```bash
docker-compose down
```

### 4. 查看日志

```bash
# 所有服务日志
docker-compose logs -f

# 仅前端日志
docker-compose logs -f frontend

# 仅后端日志
docker-compose logs -f backend
```

***

## 开发模式

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

后端运行在 <http://localhost:8000>

### 3. 启动前端开发服务器

```bash
npm run dev
```

前端运行在 <http://localhost:3000>

***

## 生产部署

### 方案 1：Docker Compose（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/LarryLi93/Personal-Blog.git
cd Personal-Blog

# 2. 启动服务
docker-compose up -d

# 3. 服务将运行在 80 端口
```

### 方案 2：手动部署

```bash
# 1. 构建前端
npm run build

# 2. 配置 Nginx（参考 nginx.conf）

# 3. 启动后端
cd backend
python main.py
```

***

## 配置说明

### 环境变量

创建 `.env.local`：

```bash
# 后端 API 地址（开发环境）
NEXT_PUBLIC_API_URL=http://localhost:8000

# 生产环境
# NEXT_PUBLIC_API_URL=https://api.islarryli.com
```

### 自定义域名

修改 `lib/config.ts`：

```typescript
export const siteConfig = {
  url: 'https://www.islarryli.com',
  name: 'LarryLi Blog',
  // ...
};
```

***

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

***

## 目录结构

```
Personal-Blog/
├── app/                    # Next.js 应用目录
│   ├── blog/[slug]/        # 文章详情页
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── sitemap.ts          # 站点地图
│   └── robots.ts           # 搜索引擎爬虫配置
├── backend/                # Python FastAPI 后端
│   ├── Dockerfile          # 后端 Docker 配置
│   ├── main.py             # 后端入口
│   └── requirements.txt    # Python 依赖
├── components/             # React 组件
├── content/articles/       # Markdown 文章
├── lib/                    # 工具函数和配置
├── public/                 # 静态资源
├── Dockerfile              # 前端 Docker 配置
├── docker-compose.yml      # Docker Compose 配置
├── nginx.conf              # Nginx 配置
└── README.md
```

***

## SEO 优化建议

1. **修改域名**：更新 `lib/config.ts` 中的 `siteConfig.url`
2. **添加 Google Analytics**：在 `app/layout.tsx` 中添加 GA 代码
3. **提交到搜索引擎**：
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)

***

## License

MIT
