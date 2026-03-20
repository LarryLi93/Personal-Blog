# SEO 配置指南

## 📝 文章 Slug 配置

所有文章的 URL 已优化为 SEO 友好的格式：

| ID | 文章标题 | Slug | 完整 URL |
|---|---|---|---|
| 1 | Dive Into LangGraph Plus | `langgraph-plus-tutorial` | `/blog/langgraph-plus-tutorial/` |
| 2 | Intellectual Obesity | `intellectual-obesity-code` | `/blog/intellectual-obesity-code/` |
| 3 | Energetic Erosion | `energetic-erosion-scrolling` | `/blog/energetic-erosion-scrolling/` |
| 4 | Future Spoilers | `future-spoilers-life-vision` | `/blog/future-spoilers-life-vision/` |
| 5 | Observer Mode | `observer-mode-reactive-living` | `/blog/observer-mode-reactive-living/` |
| 6 | Tyranny of Ambiguity | `tyranny-ambiguity-laziness` | `/blog/tyranny-ambiguity-laziness/` |

## ✅ SEO 优化点

### URL 结构
- ✅ 短小精悍（23-29 字符）
- ✅ 小写字母
- ✅ 连字符分隔
- ✅ 移除停用词（the, a, an, and, or, in, on 等）
- ✅ 包含核心关键词

### Meta 标签
- ✅ Title（带站点名后缀）
- ✅ Description
- ✅ Canonical URL
- ✅ Open Graph
- ✅ Twitter Cards
- ✅ 结构化数据（Schema.org）

### 技术 SEO
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ 静态导出（SSG）

## 🚀 部署前配置

### 1. 更新域名
编辑 `.env` 文件：
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME="Your Blog Name"
```

### 2. 构建并部署
```bash
npm run build
# 部署 dist 目录
```

## 📊 新增文章 Slug 规范

在文章 frontmatter 中手动指定 slug：

```yaml
---
id: "7"
slug: "your-seo-slug"  # 遵循以下规则
title: "Your Article Title"
---
```

### Slug 命名规则

| 规则 | 示例 |
|------|------|
| 小写字母 | ✅ `my-article` ❌ `My-Article` |
| 连字符分隔 | ✅ `my-article` ❌ `my_article` |
| 无停用词 | ✅ `seo-guide` ❌ `the-seo-guide` |
| 50-60 字符内 | ✅ `langgraph-tutorial` ❌ `complete-guide-to-langgraph-tutorial-for-beginners` |
| 含核心关键词 | ✅ `productivity-habits` ❌ `some-thoughts-on-stuff` |

### 常见停用词（应移除）

a, an, the, and, or, but, in, on, at, to, for, of, with, by, from, is, are, was, were, be, been, this, that, these, those

## 🔍 验证 SEO

部署后使用以下工具验证：

1. **Google Search Console** - 提交 sitemap
2. **Google Rich Results Test** - 验证结构化数据
3. **PageSpeed Insights** - 检查 Core Web Vitals
4. **Schema Markup Validator** - 验证 Schema.org

## 🛠️ 相关文件

- `lib/articles.ts` - Slug 生成逻辑
- `lib/config.ts` - 站点配置
- `app/sitemap.ts` - 站点地图
- `app/robots.ts` - 爬虫规则
- `app/blog/[slug]/page.tsx` - 文章页面 SEO
- `components/ArticleSchema.tsx` - 结构化数据
