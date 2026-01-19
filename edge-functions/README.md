# Edge Functions 目录 / Edge Functions Directory

这个目录包含 EdgeOne Pages 的边缘函数代码。

This directory contains Edge Functions code for EdgeOne Pages.

## 文件说明 / File Description

### `[[path]].js`

**多级动态路由通配符** / Multi-level Dynamic Wildcard Route

- 匹配所有路径（除根路径外）/ Matches all paths (except root)
- 将所有请求转发到主 Worker / Forwards all requests to main Worker
- 示例路由 / Example routes:
  - `/panel` ✅
  - `/sub/normal/abc` ✅
  - `/login` ✅
  - `/api/any/path` ✅

## EdgeOne Pages 路由系统 / EdgeOne Pages Routing System

EdgeOne Pages 使用基于文件的路由系统：

EdgeOne Pages uses a file-based routing system:

```
edge-functions/
├── index.js          → /              (根路径 / root)
├── hello.js          → /hello         (单路径 / single path)
├── [id].js           → /123           (单级动态 / single-level dynamic)
├── [[path]].js       → /any/deep/path (多级动态 / multi-level dynamic)
└── api/
    └── users.js      → /api/users     (嵌套路径 / nested path)
```

## Function Handlers

EdgeOne Pages 使用 Function Handlers 代替 addEventListener：

EdgeOne Pages uses Function Handlers instead of addEventListener:

```javascript
// 所有 HTTP 方法 / All HTTP methods
export async function onRequest(context) {
  const { request, env, params } = context;
  return new Response('Hello');
}

// 特定方法 / Specific methods
export async function onRequestGet(context) { }
export async function onRequestPost(context) { }
export async function onRequestPut(context) { }
export async function onRequestDelete(context) { }
```

## 更多信息 / More Information

查看完整文档：[EdgeOne Pages 文档](https://pages.edgeone.ai/zh/document/edge-functions)

See full documentation: [EdgeOne Pages Documentation](https://pages.edgeone.ai/zh/document/edge-functions)
