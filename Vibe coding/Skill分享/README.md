---
meta:
  - name: description
    content: Skill分享 - Vibe coding技能分享，AI编程效率提升
  - name: keywords
    content: Skill, AI编程, Prompt技巧, Claude Code, Superpowers, TDD
---

# Skill 分享

这里分享 Vibe coding 的技能和技巧，帮助你更高效地与 AI 编程助手协作。

## 什么是 Skill？

Skill 是一套**行为规范文档**，用于约束 AI 编程助手的行为方式。与传统的"工具"不同，Skill 不是让 AI "能做什么"，而是规定 AI "应该怎么做"。

### 为什么需要 Skill？

AI 编程助手的能力已经足够强大，但常常**缺乏纪律**：

| 问题 | 表现 | 后果 |
|------|------|------|
| 跳过设计 | 用户说"做个 X"，AI 立刻开写代码 | 需求理解偏差，返工 |
| 虚假完成 | "应该没问题了"、"看起来正确" | 实际未验证，bug 留到后面 |
| 乱猜修复 | 遇到 bug 连续尝试多种修复 | 引入新 bug，越修越乱 |
| 讨好倾向 | "You're absolutely right!" | 不质疑错误建议 |

Skill 通过**强制工作流**解决这些问题，让 AI 表现得像一个有纪律的高级工程师。

---

## 精选文章

### 📖 [深度解析 Superpowers](./深度解析%20Superpowers.md)

### 📖 [OpenSpec 完全使用指南：用规格驱动 AI 编码](./OpenSpec%20完全使用指南：用规格驱动%20AI%20编码.md)


---


## 相关资源

- [Superpowers 项目](https://github.com/obra/superpowers) - 原始项目仓库
- [Claude Code 官方文档](https://docs.anthropic.com/claude-code) - Anthropic 官方指南

<Vssue :title="$title" />
