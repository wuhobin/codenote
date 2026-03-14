# Superpowers 深度教学手册

> **适用环境**：Claude Code（Windows） 
<br>
> **目标读者**：已有 AI 编程助手使用经验，希望系统化提升 AI 编码质量的开发者 
<br>
> **基于版本**：Superpowers 项目 (github.com/obra/superpowers)

---

## 目录

1. [为什么需要 Superpowers](#_1-为什么需要-superpowers)
2. [核心理念：四大哲学支柱](#_2-核心理念四大哲学支柱)
3. [架构总览：Hooks → Skills → Agents](#_3-架构总览hooks--skills--agents)
4. [Hooks 机制详解](#_4-hooks-机制详解)
5. [Skills 系统详解](#_5-skills-系统详解)
6. [完整工作流编排](#_6-完整工作流编排)
7. [Agents 子代理机制](#_7-agents-子代理机制)
8. [Skill 编写方法论（TDD for Documentation）](#_8-skill-编写方法论tdd-for-documentation)
9. [在 Windsurf / Cursor / OpenCode 中落地](#_9-在-windsurf--cursor--opencode-中落地)
10. [与你现有 Skills 体系的对照](#_10-与你现有-skills-体系的对照)
11. [实战：从想法到交付的完整流程演练](#_11-实战从想法到交付的完整流程演练)
12. [速查表](#_12-速查表)

---

## 1. 为什么需要 Superpowers

### AI 编程助手的根本问题

AI 不是能力不足，而是**缺乏纪律**。典型表现：

| 问题 | 表现 | 后果 |
|------|------|------|
| 跳过设计 | 用户说"做个 X"，AI 立刻开写代码 | 需求理解偏差，返工 |
| 虚假完成 | "应该没问题了"、"看起来正确" | 实际未验证，bug 留到后面 |
| 乱猜修复 | 遇到 bug 连续尝试 5 种修复 | 引入新 bug，越修越乱 |
| 讨好倾向 | "You're absolutely right!" | 不质疑错误建议 |
| 上下文污染 | 长对话后 AI 记混了之前的讨论 | 产出不一致 |

### Superpowers 的解法

用 **14 个互相编排的 Skills（行为规范文档）** 组成一套强制工作流，让 AI 表现得像一个有纪律的高级工程师。

**关键认知**：Superpowers 的 Skills 不是"工具"，而是"行为约束"——它们是写给 AI 看的规章制度。

---

## 2. 核心理念：四大哲学支柱

### 2.1 测试驱动开发（TDD）

```
铁律：NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
先写了代码？删掉它。不留作参考。不改编。删除就是删除。
```

**RED-GREEN-REFACTOR 循环**：
1. **RED** — 写一个最小测试，运行，确认**失败**（不是报错）
2. **GREEN** — 写**最简代码**让测试通过（不多不少）
3. **REFACTOR** — 测试保持绿色的前提下清理代码
4. 重复

**为什么顺序重要**：测试先于代码 = "代码应该做什么？"；代码先于测试 = "代码做了什么？"。后者是倒果为因。

### 2.2 系统性调试

```
铁律：NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

**四阶段**：
1. 根因调查（读错误信息 → 稳定复现 → 检查最近变更 → 逐层诊断）
2. 模式分析（找正常工作的同类代码 → 对比差异）
3. 假设与测试（单一假设 → 最小变更 → 不叠加修复）
4. 实施（创建失败测试 → 单一修复 → 验证）

**3 次规则**：3+ 次修复都失败 → 停下来质疑架构，不要再试第 4 次。

### 2.3 证据先于断言

```
铁律：NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

禁止用词："should work"、"probably"、"seems to"、"Great!"、"Done!"

**五步验证门**：确定命令 → 执行 → 读完整输出 → 确认 → 然后才能声称完成。

### 2.4 YAGNI（You Aren't Gonna Need It）

不要为假想的未来需求写代码。测试要求什么，就写什么，不多不少。

---

## 3. 架构总览：Hooks → Skills → Agents

```
superpowers/
├── hooks/                  ← 系统启动层（平台生命周期钩子）
│   ├── hooks.json          ← 事件注册：SessionStart 时触发
│   └── session-start       ← 注入 using-superpowers 到 AI 上下文
│
├── skills/                 ← 核心层（14 个行为规范文档）
│   ├── using-superpowers/         ← 元技能：教 AI 使用技能系统
│   │
│   │── [工作流技能 - 按顺序执行]
│   ├── brainstorming/             ← 需求 → 设计
│   ├── using-git-worktrees/       ← 创建隔离工作空间
│   ├── writing-plans/             ← 设计 → 实施计划
│   ├── subagent-driven-development/ ← 子 Agent 逐任务执行
│   ├── executing-plans/           ← 批次执行（备选）
│   ├── finishing-a-development-branch/ ← 分支收尾
│   │
│   │── [纪律执行技能 - 全程贯穿]
│   ├── test-driven-development/   ← TDD 铁律
│   ├── systematic-debugging/      ← 系统性调试
│   ├── verification-before-completion/ ← 完成前验证
│   │
│   │── [协作技能]
│   ├── requesting-code-review/    ← 请求代码审查
│   ├── receiving-code-review/     ← 接收代码审查
│   ├── dispatching-parallel-agents/ ← 并行 Agent 调度
│   │
│   └── writing-skills/            ← 元能力：创建新技能
│
├── agents/                 ← 子 Agent 角色模板
│   └── code-reviewer.md   ← 代码审查员的系统提示
│
├── commands/               ← 已废弃（全部指向 skills）
└── docs/                   ← 设计文档、计划文档
```

**层次关系**：
- **Hooks** 是地基 — 确保 AI 知道自己有超能力
- **Skills** 是主体 — 定义 AI 在每个场景下必须怎么做
- **Agents** 是角色 — 被 Skills 调用的专业子代理

---

## 4. Hooks 机制详解

### 4.1 什么是 Hook

Hook 是**平台级事件钩子**，在 AI 会话的特定生命周期事件发生时自动触发。Superpowers 只用了一个 Hook：`SessionStart`。

### 4.2 工作流程

```
用户启动/恢复/清除/压缩会话
        │
        ▼
平台检查 hooks.json → 匹配 SessionStart 事件
        │
        ▼
执行 session-start 脚本
        │
        ├── 读取 skills/using-superpowers/SKILL.md 全文
        ├── 包裹在 <EXTREMELY_IMPORTANT> 标签中
        └── 输出 JSON → 平台注入到 AI 上下文
        
        ▼
AI 开始对话时已经知道：
"我有超能力。做任何事之前必须检查是否有相关 skill。"
```

### 4.3 设计精髓

Hook **只注入一个** skill（`using-superpowers`），而不是全部 14 个。原因：

1. **最小上下文消耗** — 14 个 skill 全文超过万字，一次注入会浪费大量上下文窗口
2. **按需加载** — 元技能教 AI "需要时再调用具体 skill"，就像操作系统内核按需加载驱动
3. **级联触发** — `using-superpowers` 说"做任何事前检查 skill"，AI 自然会去找 `brainstorming`、`tdd` 等

### 4.4 在各平台中的对应

| 平台 | Hook 支持情况 | 替代方案 |
|------|-------------|---------|
| Claude Code | 原生支持 `hooks.json` | — |
| Windsurf | 不支持 Hook | 通过 User Rules / Memory 注入核心指令 |
| Cursor | 不支持 Hook | 通过 `.cursorrules` / Rules 注入核心指令 |
| OpenCode | 不支持 Hook | 通过 `AGENTS.md` 注入核心指令 |

**实际影响**：Hook 只是注入的**方式**不同，注入的**内容**（行为约束）可以通过各平台的规则文件实现等效。

---

## 5. Skills 系统详解

### 5.1 Skill 的本质

每个 Skill 是一个 `SKILL.md` 文件，包含：

```yaml
---
name: skill-name
description: Use when [触发条件]  # 只写何时触发，不写流程摘要
---

# Skill 名称

## Overview        # 核心原则 1-2 句
## When to Use     # 触发条件 + 不适用场景
## The Iron Law    # 铁律（不可违反的规则）
## The Process     # 具体流程（含 Graphviz 流程图）
## Red Flags       # AI 可能找的借口 + 反驳
## Common Rationalizations  # 更多借口和反驳表
## Integration     # 与其他 skill 的调用关系
```

**关键设计**：
- **description 只写触发条件**，绝不写流程摘要（否则 AI 会走捷径只读 description 不读全文）
- **铁律不可违反** — 明确列出"如果你想跳过，你正在找借口"
- **借口反驳表** — 预测 AI 的所有借口并逐一封堵

### 5.2 工作流 Skills（按执行顺序）

#### ① brainstorming — 从想法到设计

**触发**：用户说"让我们做 X"、"帮我建一个 Y"

**Hard Gate**：未经用户批准设计之前，**禁止写任何代码**

**9 步流程**：
1. 探索项目上下文（文件、文档、最近提交）
2. 提供可视化伴侣（如涉及 UI）
3. **逐个提问**澄清需求（一次一个问题，不轰炸）
4. 提出 2-3 种方案 + 推荐理由
5. **分段**展示设计，每段获批后继续
6. 写设计文档 → `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
7. 派发 spec-reviewer 子 Agent 审查（最多 5 轮）
8. 用户审查书面规格书
9. 转交 `writing-plans` skill

**关键原则**：
- **"太简单不需要设计"是反模式** — 越简单的项目越容易因为假设偏差浪费时间
- **设计为隔离性服务** — 小单元、清晰接口、可独立测试
- **YAGNI 至上** — 砍掉不需要的功能

#### ② using-git-worktrees — 工作空间隔离

**触发**：设计批准后、执行计划前

**作用**：
- 在新 branch + worktree 中创建隔离工作环境
- 自动检测项目类型并安装依赖（npm/cargo/pip/go）
- 运行测试确认干净基线
- 验证 worktree 目录被 `.gitignore` 忽略

#### ③ writing-plans — 编写实施计划

**触发**：有规格书后

**核心思想**：计划的目标读者是"热情但缺乏品味和判断力的初级工程师"。

**任务粒度**：每步 2-5 分钟
```markdown
### Task N: [组件名]

**Files:**
- Create: `exact/path/to/file.py`
- Test: `tests/exact/path/to/test.py`

- [ ] Step 1: 写失败测试（含完整代码）
- [ ] Step 2: 运行确认失败（含精确命令和预期输出）
- [ ] Step 3: 写最小实现（含完整代码）
- [ ] Step 4: 运行确认通过（含精确命令和预期输出）
- [ ] Step 5: 提交（含 git 命令）
```

**不允许出现**：
- "添加验证逻辑" ← 必须写出具体代码
- "运行测试" ← 必须写出 `pytest tests/path/test.py::test_name -v`

#### ④ subagent-driven-development — 子 Agent 驱动开发（首选）

**触发**：有计划 + 平台支持子 Agent

**流程**（每个任务）：
```
派发 implementer 子Agent → 实现+测试+提交+自审
        │
        ▼
派发 spec-reviewer 子Agent → 确认符合规格
        │ (不通过则 implementer 修复 → 重新审查)
        ▼
派发 code-quality-reviewer 子Agent → 确认代码质量
        │ (不通过则 implementer 修复 → 重新审查)
        ▼
标记任务完成 → 下一个任务
```

**为什么用子 Agent**：
- **隔离上下文** — 每个任务一个新 Agent，不会被之前的讨论污染
- **精准投喂** — 主 Agent 作为协调者，为子 Agent 精心构造所需的上下文
- **省成本** — 简单任务用便宜模型，复杂任务用强模型

#### ⑤ executing-plans — 批次执行（备选）

**触发**：有计划 + 平台不支持子 Agent

在当前会话中按步骤执行，分批执行带人工检查点。Windsurf 和 Cursor 目前主要使用这种模式。

#### ⑥ finishing-a-development-branch — 分支收尾

**触发**：所有任务完成后

验证测试通过 → 提供恰好 4 个选项：
1. 本地合并到主分支
2. 推送并创建 Pull Request
3. 保持分支原样
4. 丢弃工作（需输入 "discard" 确认）

### 5.3 纪律执行 Skills（全程贯穿）

这三个 Skill 不在工作流的特定位置触发，而是**全程贯穿**：

| Skill | 铁律 | 何时触发 |
|-------|------|---------|
| `test-driven-development` | 没有失败测试就没有生产代码 | 实现任何功能/修复 bug 时 |
| `systematic-debugging` | 没有根因调查就没有修复 | 遇到任何 bug/测试失败时 |
| `verification-before-completion` | 没有验证证据就没有完成声明 | 声称"修好了"/"完成了"之前 |

### 5.4 协作 Skills

| Skill | 作用 |
|-------|------|
| `requesting-code-review` | 派发 code-reviewer 子 Agent，提供精心构造的上下文 |
| `receiving-code-review` | 接收反馈时：禁止奉承、技术性验证、必要时推回 |
| `dispatching-parallel-agents` | 多个独立问题并行派发 Agent 解决 |

### 5.5 元能力 Skill

`writing-skills` — 创建新 Skill 本身也遵循 TDD：
- **RED**：不给 skill 的情况下让 Agent 做任务，记录它怎么违规
- **GREEN**：写 skill 封堵那些违规
- **REFACTOR**：找到新借口 → 加入反驳 → 重测

---

## 6. 完整工作流编排

### 端到端流程图

```
会话启动
    │
    ▼
[Hook/Rules 注入] ──▶ using-superpowers 激活
    │
    ▼
用户: "帮我做 X"
    │
    ▼
[brainstorming] ──▶ 探索上下文 → 逐个提问 → 2-3 方案 → 分段设计
    │                    → 设计文档 → spec-reviewer 审查 → 用户审批
    │
    ▼
[using-git-worktrees] ──▶ 新 branch → 安装依赖 → 基线测试
    │
    ▼
[writing-plans] ──▶ 拆解为 2-5 分钟原子任务 → plan-reviewer 审查
    │
    ▼
    ┌─── 有子 Agent？───┐
    │ YES               │ NO
    ▼                   ▼
[subagent-driven-    [executing-plans]
 development]         批次执行 + 人工检查
 每任务:
   implementer
   → spec-reviewer       ← 每个任务中全程贯穿:
   → code-quality-rev      [test-driven-development]
                            [systematic-debugging]
                            [verification-before-completion]
    │
    ├── 任务间 ──▶ [requesting-code-review]
    │                └──▶ [receiving-code-review]
    │
    ▼
[finishing-a-development-branch] ──▶ 验证 → merge/PR/keep/discard
```

### 多层质量门控

Superpowers 的核心价值在于**多层门控，每层不通过就不能前进**：

| 门控点 | 谁把关 | 不通过怎么办 |
|--------|--------|------------|
| 设计审批 | 用户 | 回到 brainstorming 继续讨论 |
| 规格书审查 | spec-reviewer 子 Agent | 修复 → 重新审查（最多 5 轮） |
| 计划审查 | plan-reviewer 子 Agent | 修复 → 重新审查 |
| 测试失败 | test-driven-development | 修代码不修测试 |
| 规格合规审查 | spec-reviewer 子 Agent | implementer 修复 → 重新审查 |
| 代码质量审查 | code-quality-reviewer | implementer 修复 → 重新审查 |
| 完成前验证 | verification-before-completion | 必须跑命令拿到证据 |
| 分支收尾 | finishing-a-development-branch | 测试不过不能 merge |

---

## 7. Agents 子代理机制

### 什么是 Agent

在 Superpowers 中，Agent 是一个**角色模板**（系统提示），被 Skill 作为子 Agent 派发。

项目中唯一的 Agent 定义是 `agents/code-reviewer.md`，它定义了代码审查员的：
- 角色定位（Senior Code Reviewer）
- 6 项审查维度（计划对齐、代码质量、架构、文档、问题识别、沟通协议）
- 问题分级标准（Critical / Important / Suggestions）

### Agent vs Skill 的关系

```
Skill（行为规范）定义了 AI "应该做什么"
Agent（角色模板）定义了子代理 "是谁、怎么审查"
Skill 调用 Agent：requesting-code-review skill → 派发 code-reviewer agent
```

### 在你的环境中

Windsurf、Cursor、OpenCode 目前**不支持原生子 Agent 派发**。替代方案：
- AI 可以在同一会话中"自我角色切换"来模拟审查
- 你可以手动开一个新会话做代码审查
- 使用 `executing-plans` 而非 `subagent-driven-development`

---

## 8. Skill 编写方法论（TDD for Documentation）

Superpowers 最具创新性的思想之一：**创建 Skill 本身也是 TDD**。

### RED-GREEN-REFACTOR 应用于文档

| TDD 概念 | Skill 创建 |
|----------|-----------|
| 测试用例 | 压力场景（让 Agent 在诱惑下尝试违规） |
| 生产代码 | SKILL.md 文档 |
| RED（测试失败） | Agent 在没有 skill 时违规了 |
| GREEN（测试通过） | Agent 有了 skill 后遵守了 |
| REFACTOR | 发现新借口 → 加入反驳 → 重测 |

### 示例：创建 TDD Skill 的过程

**RED 阶段**：让 Agent 修一个 bug，不给 TDD skill
- 观察：Agent 直接改代码，写了测试后测试直接通过
- 记录借口："太简单不需要测试"、"我先探索一下"

**GREEN 阶段**：写 SKILL.md
- 加入铁律："没有失败测试就没有生产代码"
- 加入反驳表："太简单 → 简单代码也会坏"
- 重测：Agent 现在先写测试了

**REFACTOR 阶段**：再次施压
- 发现新借口："我保留代码作参考"
- 加入反驳："不留参考、不改编、删除就是删除"
- 重测直到无懈可击

### Skill 文件规范

```yaml
---
name: my-skill-name              # 只用字母、数字、连字符
description: Use when [触发条件]   # 第三人称，只写何时触发
---
```

**description 的陷阱**：
```yaml
# ❌ 错误：写了流程摘要 → AI 会走捷径只读这里
description: 每个任务后派发子Agent做代码审查

# ✅ 正确：只写触发条件 → AI 必须读完整 skill
description: Use when executing implementation plans with independent tasks
```

---

## 9. 在 Windsurf / Cursor / OpenCode 中落地

### 9.1 你当前的 Skills 生态

你在 `~/.agents/skills/` 下有 17 个跨工具共享的 skills：

| Skill | 功能类型 |
|-------|---------|
| `self-improving-agent` | 持续学习（错误/纠正/功能请求记录） |
| `test-case-generator` | 测试用例生成 |
| `api-test-generator` | API 接口测试脚本生成 |
| `generate-ui-testcases` | UI 测试用例生成 |
| `postman-test-generator` | Postman 测试集生成 |
| `test-data-factory` | 测试数据准备 |
| `test-reviewer` | 测试全流程质量审查 |
| `regression-test` | 回归测试检测 |
| `playwright-test-platform` | UI 自动化录制脚本 |
| `requirement-doc-parser` | 需求文档解析 |
| `output-reviewer` | 产物审查 |
| `requesting-code-review` | 代码审查 |
| `verification-before-completion` | 完成前验证 |
| `skill-creator` | 创建新 skill |
| `find-skills` | 发现可安装的 skill |
| `feishu-notify` | 飞书推送 |
| `web-design-guidelines` | Web UI 审查 |

### 9.2 你的 Skills vs Superpowers Skills 对比

| 维度 | 你的 `~/.agents/skills/` | Superpowers `skills/` |
|------|--------------------------|----------------------|
| **本质** | 可执行的工具/脚本能力 | 行为规范文档 |
| **作用** | "AI 能做什么"（执行能力） | "AI 应该怎么做"（行为约束） |
| **触发** | AI 判断 + 用户调用 | 强制：哪怕 1% 可能性也必须触发 |
| **加载** | 全局 `~/.agents/skills/` | 按需从插件目录加载 |
| **扩展** | 写 SKILL.md + 支持脚本 | 写 SKILL.md |

**互补关系示例**：
- Superpowers 的 `verification-before-completion` 规定了"必须验证" → 你的 `verification-before-completion` skill 提供了**如何验证**
- Superpowers 的 `brainstorming` 规定了"必须先设计再编码" → 你的 `requirement-doc-parser` 提供了**如何解析需求**
- Superpowers 的 `requesting-code-review` 规定了"必须做代码审查" → 你的 `output-reviewer` 提供了**审查能力**

### 9.3 各平台 Superpowers 思想落地方案

#### Windsurf 落地

**Step 1：通过 User Rules 注入核心行为约束**

在 Windsurf Settings → User Rules 中加入核心约束（模拟 Hook 注入效果）：

```
## 开发纪律

1. 任何功能开发前，必须先完成需求讨论和设计确认，不得直接写代码
2. 所有代码修改必须遵循 TDD：先写失败测试 → 确认失败 → 写最小实现 → 确认通过
3. 遇到 bug 必须先做根因调查，禁止猜测性修复
4. 声称完成前必须运行验证命令并展示输出，禁止使用"应该没问题"等措辞
5. 代码审查反馈不得使用奉承语句，必须技术性回应
```

**Step 2：通过 Workflows 定义可复用流程**

```
.windsurf/workflows/
├── brainstorm.md        # 需求头脑风暴流程
├── write-plan.md        # 实施计划编写流程
├── execute-plan.md      # 计划执行流程
├── tdd.md               # TDD 红绿重构流程
└── debug.md             # 系统性调试流程
```

Workflow 示例（`brainstorm.md`）：
```yaml
---
description: 在开始编码前进行需求讨论和设计确认
---

1. 探索项目上下文 — 检查文件、文档、最近提交
2. 逐个提问澄清需求 — 一次只问一个问题
3. 提出 2-3 种方案并推荐
4. 分段展示设计，每段获批后继续
5. 写设计文档保存到 docs/ 目录
6. 用户确认后再进入实施阶段
```

**Step 3：通过 Memory 持久化重要经验**

Windsurf 的 `create_memory` 工具自动跨会话持久化，结合你的 `self-improving-agent` skill 的 `.learnings/` 记录，形成两层记忆：
- **短期**：`.learnings/` 文件记录每次错误和学习
- **长期**：Memory 持久化关键经验

#### Cursor 落地

**Step 1：通过 `.cursorrules` 或 `.cursor/rules/` 注入**

在项目根目录创建 `.cursorrules`：

```markdown
# 开发纪律（来自 Superpowers 最佳实践）

## 铁律
- 不经过设计讨论不得直接写代码
- 不先写失败测试不得写生产代码
- 不找到根因不得提出修复方案
- 不运行验证命令不得声称完成

## TDD 循环
RED → 写最小测试 → 确认失败
GREEN → 写最小代码 → 确认通过
REFACTOR → 清理代码 → 保持测试绿色

## 调试流程
1. 读错误信息（完整读）
2. 稳定复现
3. 检查最近变更
4. 逐层添加诊断
5. 形成单一假设
6. 最小变更测试
```

**Step 2：Cursor Rules（.mdc 文件）实现更细粒度控制**

```
.cursor/rules/
├── tdd.mdc              # TDD 规则（自动触发）
├── debugging.mdc        # 调试规则（自动触发）
└── verification.mdc     # 验证规则（自动触发）
```

#### OpenCode 落地

**Step 1：通过 `AGENTS.md` 注入**

在项目根目录的 `AGENTS.md` 中加入 Superpowers 的核心约束。

**Step 2：通过全局 commands 定义流程**

```
~/.config/opencode/commands/
├── brainstorm.md
├── write-plan.md
└── execute-plan.md
```

OpenCode 的 commands 是全局的，所有项目自动共享。

### 9.4 跨工具统一配置策略

基于你的 `self-improving-agent` skill 已经定义的跨工具兼容架构：

```
~/.agents/skills/              ← 全局 Skills（三工具共享）
    ├── self-improving-agent/  ← 持续学习
    ├── ...其他 skills...
    └── .learnings/            ← 全局学习记录

项目根目录/
    ├── AGENTS.md              ← 项目级指令（三工具均读取）
    ├── .windsurf/workflows/   ← Windsurf 专用流程
    ├── .cursor/rules/         ← Cursor 专用规则
    └── .opencode/             ← OpenCode 专用配置
```

**推荐策略**：
1. **核心约束**放在 `AGENTS.md` → 三工具均自动读取
2. **Superpowers 思想精华**提炼为简短规则放入 `AGENTS.md`
3. **工具特定流程**分别放入各工具目录
4. **学习记录**统一用 `~/.agents/skills/self-improving-agent/.learnings/`

---

## 10. 与你现有 Skills 体系的对照

### 你的测试技能矩阵 vs Superpowers TDD

| 你的 Skill | 做什么 | Superpowers 对应 | 提供什么 |
|-----------|--------|-----------------|---------|
| `test-case-generator` | 生成测试用例 | `writing-plans` | 规定计划中每步必须包含测试 |
| `api-test-generator` | 生成 API 测试脚本 | `test-driven-development` | 强制 RED-GREEN-REFACTOR |
| `test-data-factory` | 准备测试数据 | — | 无对应（你的更细化） |
| `test-reviewer` | 审查测试质量 | `requesting-code-review` | 审查流程和分级标准 |
| `regression-test` | 回归检测 | `systematic-debugging` | 根因调查方法论 |

**结论**：你的 skills 提供**执行能力**，Superpowers 提供**行为框架**。两者结合最佳。

### self-improving-agent vs Superpowers 的学习方式

| 维度 | self-improving-agent | Superpowers |
|------|---------------------|-------------|
| 学习记录 | `.learnings/` 结构化 Markdown | 无专门记录机制 |
| 晋升机制 | 低优先级 → 高优先级 → promote | 无（skill 本身是成品） |
| 跨会话 | 通过文件持久化 | 依赖平台（Hook 每次注入） |
| 自我纠正 | 检测 trigger + 日志 | 封堵借口表 + Red Flags |

**互补建议**：用 `self-improving-agent` 记录你在使用 Superpowers 工作流时发现的问题，然后 promote 到 `AGENTS.md`。

---

## 11. 实战：从想法到交付的完整流程演练

### 场景：在 Windsurf 中开发一个 REST API 功能

#### Step 1：启动对话（模拟 Hook 注入）

你的 User Rules 已经包含核心约束。你对 AI 说：

> "帮我给用户管理模块添加一个密码重置功能"

#### Step 2：AI 激活 brainstorming 流程

AI 不直接写代码，而是：
1. 检查项目现有的用户管理代码
2. 问你："密码重置是通过邮件链接还是短信验证码？"（一次一个问题）
3. 问你："重置链接的有效期多长？"
4. 提出 2 种方案：A. 邮件链接 + JWT  B. 短信验证码 + Redis
5. 推荐方案 A 并说明理由
6. 分段展示设计：API 端点 → 邮件模板 → 安全考虑
7. 你确认后，写设计文档

#### Step 3：AI 编写实施计划

```markdown
### Task 1: 密码重置请求端点

- [ ] Step 1: 写失败测试
  ```python
  def test_password_reset_request_sends_email():
      response = client.post("/api/reset-password", json={"email": "user@test.com"})
      assert response.status_code == 200
      assert mock_email.called
  ```

- [ ] Step 2: 运行确认失败
  Run: `pytest tests/test_password_reset.py::test_password_reset_request_sends_email -v`
  Expected: FAIL with "No module named 'routes.password_reset'"

- [ ] Step 3: 写最小实现
  [完整代码]

- [ ] Step 4: 运行确认通过

- [ ] Step 5: 提交
```

#### Step 4：按计划执行（TDD 全程贯穿）

每个 Step 严格按顺序执行：
- 先写测试 → 运行看到失败 → 写代码 → 运行看到通过 → 提交
- 遇到 bug → 不猜，走 systematic-debugging 四阶段
- 声称完成前 → 跑完整测试套件并展示输出

#### Step 5：代码审查 + 收尾

- AI 请求代码审查，展示变更摘要
- 处理审查反馈（技术性回应，不奉承）
- 提供 4 个收尾选项

---

## 12. 速查表

### Superpowers 铁律速查

| 铁律 | 含义 |
|------|------|
| 没有设计就没有代码 | `brainstorming` Hard Gate |
| 没有失败测试就没有生产代码 | `test-driven-development` |
| 没有根因调查就没有修复 | `systematic-debugging` |
| 没有验证证据就没有完成声明 | `verification-before-completion` |
| 3 次修复失败就质疑架构 | `systematic-debugging` Phase 4.5 |

### 各平台配置速查

| 配置项 | Windsurf | Cursor | OpenCode |
|--------|----------|--------|----------|
| 核心约束注入 | User Rules / Memory | `.cursorrules` | `AGENTS.md` |
| 项目级规则 | `.windsurf/rules/` | `.cursor/rules/*.mdc` | `.opencode/` |
| 可复用流程 | `.windsurf/workflows/` | Rules（描述触发） | `~/.config/opencode/commands/` |
| 跨工具 Skills | `~/.agents/skills/` | `~/.agents/skills/` | `~/.agents/skills/` |
| 学习记录 | `~/.agents/skills/self-improving-agent/.learnings/` | 同左 | 同左 |
| 经验晋升 | `create_memory` | `.cursorrules` | `AGENTS.md` |

### Skill 编写速查

```yaml
---
name: lowercase-with-hyphens
description: Use when [只写触发条件，不写流程]
---

# Skill 名称
## Overview        — 核心原则 1-2 句
## The Iron Law    — 不可违反的规则
## When to Use     — 触发条件 + 不适用场景
## The Process     — 具体流程
## Red Flags       — AI 可能的借口
## Common Rationalizations — 借口反驳表
## Integration     — 与其他 skill 的关系
```

### 工作流触发速查

| 你说的话 | 应该触发的 Skill |
|---------|-----------------|
| "帮我做/建/加 X" | brainstorming → writing-plans → executing |
| "修这个 bug" | systematic-debugging → tdd |
| "完成了吗？" | verification-before-completion |
| "审查一下代码" | requesting-code-review |
| "测试都通过了" | verification（必须展示证据） |

---

> **文档版本**：2026-03-13
> **基于项目**：[Superpowers](https://github.com/obra/superpowers) by Jesse Vincent (obra)
> **适配环境**：Windsurf + Cursor + OpenCode on Windows
