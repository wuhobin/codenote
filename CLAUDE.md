# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概览

这是一个基于 VuePress v1 的编程博客/文档网站，名为"Aurora的编程宝典"。部署在 GitHub Pages 上，地址为 `https://ai.wuhobin.top`。

## 常用命令

- `npm run docs:dev` - 启动开发服务器，支持热重载
- `npm run docs:build` - 构建静态站点（输出到 `.vuepress/dist`）
- `npm run deploy` - 部署到 GitHub Pages（通过 `deploy.sh`）

## 架构说明

### 配置结构

VuePress 配置被拆分为多个 TypeScript 模块文件，位于 `.vuepress/` 目录：
- `config.ts` - 主配置文件，包含插件、主题和 SEO 设置
- `navbar.ts` - 顶部导航菜单
- `sidebar.ts` - 将侧边栏配置路由到各个目录
- `sidebars/*.ts` - 各目录的侧边栏配置（如 `programmingShareSideBar.ts`、`interviewTopicSideBar.ts`）
- `footer.ts` - 页脚配置
- `extraSideBar.ts` - 额外的右侧边栏

`.vuepress/*.ts` 和 `.vuepress/sidebars/*.ts` 中的所有配置变更都会被监听以实现热重载（参见 `extraWatchFiles`）。

### 主题

主题基于 VuePress 默认主题进行了扩展，包含自定义组件和布局：
- `.vuepress/theme/` - 自定义主题扩展
  - `components/` - 自定义 Vue 组件（ExtraSidebar、Footer、Navbar、Page 等）
  - `layouts/` - 自定义 Layout.vue
  - `styles/` - 自定义 CSS
  - `util/` - 主题工具函数

### 内容组织

内容以中文目录的形式组织在根目录下：
- `编程分享/` - 编程文章（入门必看-学习路线、资源推荐、技术分享）
- `面试专题/` - 面试专题（Mysql 系列、Redis 系列）

侧边栏配置使用路径引用，如 `'入门必看-学习路线/'`，指向子目录。添加内容时：
1. 在对应目录中创建/更新 Markdown 文件
2. 更新 `.vuepress/sidebars/` 中对应的侧边栏配置
3. 对于新目录，需在 `sidebar.ts` 中添加侧边栏条目

### 主要插件

- `@vssue/vuepress-plugin-vssue` - 基于 GitHub 的评论功能（仓库：wuhobin/codenote-comment）
- `vuepress-plugin-tags` - 基于标签的内容组织
- `vuepress-plugin-code-copy` - 代码块复制功能
- SEO 插件：`seo`、`sitemap`、`feed`、`baidu-autopush`
- 统计分析：Google Analytics、百度统计

### 部署

`deploy.sh` 脚本执行以下操作：
1. 构建站点（`npm run docs:build`）
2. 为 `ai.wuhobin.top` 创建 CNAME 文件
3. 将构建文件推送到 `git@github.com:wuhobin/wuhobin.github.io.git master`

## 重要提示

- 使用的是 VuePress v1（非 v2）
- 配置文件使用 TypeScript，并包含 `@ts-ignore` 注释以兼容类型
- 站点使用自定义中文域名配合 GitHub Pages
- Markdown 内容应包含 frontmatter 用于 SEO（date、description、tags、image）
- GitHub 编辑链接已启用（`editLinks: true`）
