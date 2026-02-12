# 候选人评论功能执行计划 (Candidate Comment Feature)

## 1. 概述
为 HR 管理系统引入类似 Twitter (X) 风格的社交化评论系统。评论将围绕候选人的简历（Resume）展开，作为面试官（Interviewer）和 HR 之间的主要沟通渠道。

### 核心特性
- **时间轴布局**: 按照评论先后顺序展示，左侧头像，右侧内容的 Twitter 风格。
- **角色标识**: 自动区分 HR 和面试官标签。
- **沉浸式编辑**: 支持全屏模式的长篇面试评价撰写。
- **侧边栏集成**: 在简历预览模态框中提供实时的评论互动面板。

---

## 2. 数据架构

### 2.1 类型定义 (`src/types/candidate.ts`)
```typescript
export interface CandidateComment {
  id: string;
  candidateId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: "HR" | "Interviewer";
  content: string; // 支持简化的 Markdown
  createdAt: string; // ISO Date String
}

// 扩展 Candidate 接口
export interface Candidate {
  // ... 现有字段
  comments?: CandidateComment[];
}
```

### 2.2 API 接口 (`src/lib/api.ts`)
- `GET /candidates/{id}/comments`: 获取评论列表。
- `POST /candidates/{id}/comments`: 发表新评论。
- `DELETE /comments/{commentId}`: 删除自己的评论（可选）。

### 2.3 React Query Hooks
- `useCandidateComments(candidateId)`: 自动刷新评论流。
- `useAddCandidateComment()`: 提交评论并使查询失效以触发重新拉取。

---

## 3. 组件开发策略

### 3.1 基础组件 (`src/components/candidates/comments/`)
1. **`CommentItem.tsx`**: 
   - 视觉风格：Twitter 消息项。
   - 包含：头像、姓名、角色勋章、时间戳、评论文本。
2. **`CommentInput.tsx`**:
   - 初始状态：单行或三行文本框。
   - 特性：自动增高 (Auto-expand)。
   - 右上角：[↗] 按钮触发沉浸式对话框。
   - 底部：[发布] 按钮，支持 `Cmd/Ctrl + Enter`。
3. **`CommentEditorDialog.tsx` (核心)**:
   - 全屏/大尺寸 `Dialog`。
   - 提供沉浸式写作环境，显示候选人姓名作为上下文。
   - 内置简易预览。

### 3.2 布局组件
- **`CandidateCommentSection.tsx`**:
  - 组合 `CommentInput` 和 `CommentItem` 列表。
  - 用于 `CandidateDetail` 详情页底部。

---

## 4. UI/UX 详细设计

### 4.1 沉浸式编辑体验
- **聚焦模式**: 点击展开后，隐藏所有背景干扰，仅保留编辑器和顶部的候选人摘要。
- **自动保存**: 实时保存草稿到 `localStorage`，防止窗口误关丢失。
- **键盘流**: `Esc` 退出并询问保存，`Cmd+Enter` 直接发送。

### 4.2 简历预览视图集成 (`ResumePreviewModal.tsx`)
- **联动面板**:
  - 增加 `Comments` 标签页或侧边栏。
  - **吸附输入框**: 评论流在侧边滚动，但输入框始终固定在侧边栏底部。
  - **红点提示**: 在 Header 的评论图标上显示未读或总计评论数。

---

## 5. 实施路线图 (Implementation Milestones)

- [ ] **Milestone 1**: 类型定义与 Mock 数据准备。
- [ ] **Milestone 2**: 开发 `CommentItem` 和 `CommentSection` 静态展示组件。
- [ ] **Milestone 3**: 开发带自动增高功能的 `CommentInput`。
- [ ] **Milestone 4**: 实现 `CommentEditorDialog` 全屏沉浸式编辑器。
- [ ] **Milestone 5**: 将评论系统集成至 `CandidateDetail`。
- [ ] **Milestone 6**: 在 `ResumePreviewModal` 中实现三栏/双栏切换，加入评论侧边栏。
- [ ] **Milestone 7**: 润色（Markdown 渲染、i18n 翻译、Loading/Error 状态）。

---

## 6. 视觉效果参考
```text
[ Avatar ] 张三 [HR] · 2分钟前
           候选人 React 基础非常扎实，建议推进到二面。
           --------------------------------------------------
[ Avatar ] 李四 [面试官] · 刚刚
           [沉浸式编辑内容...]
           代码风格非常好，对工程化有独立见解。
```
