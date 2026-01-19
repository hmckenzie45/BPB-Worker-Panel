# EdgeOne Pages 兼容性说明 / EdgeOne Pages Compatibility Notes

## 架构兼容性 / Architecture Compatibility

BPB Worker Panel 完全兼容 EdgeOne Pages 平台。EdgeOne Pages 基于 V8 引擎，遵循 Web Service Worker API 标准，与 Cloudflare Workers 高度兼容。

BPB Worker Panel is fully compatible with EdgeOne Pages platform. EdgeOne Pages is based on V8 engine and follows Web Service Worker API standards, highly compatible with Cloudflare Workers.

## EdgeOne Pages 特性 / EdgeOne Pages Features

### 文件路由系统 / File-based Routing System

EdgeOne Pages 使用基于文件的路由系统：

EdgeOne Pages uses a file-based routing system:

- **目录结构 / Directory Structure**: `/edge-functions/` 目录下的文件自动映射为路由
- **动态路由 / Dynamic Routes**: 
  - `[id].js` - 单级动态路由 / Single-level dynamic route
  - `[[path]].js` - 多级通配符路由 / Multi-level wildcard route
- **Function Handlers**: 支持 `onRequest`, `onRequestGet`, `onRequestPost` 等方法

**BPB Worker Panel 实现：**
项目使用 `/edge-functions/[[path]].js` 作为通配符路由，捕获所有请求并转发到主 Worker。

**BPB Worker Panel Implementation:**
The project uses `/edge-functions/[[path]].js` as a wildcard route to catch all requests and forward them to the main Worker.

## API 兼容性 / API Compatibility

### 完全兼容 / Fully Compatible ✅

以下 Runtime APIs 在 EdgeOne Pages 和 Cloudflare Workers 上完全兼容：

The following Runtime APIs are fully compatible between EdgeOne Pages and Cloudflare Workers:

- `fetch()` - HTTP 请求处理 / HTTP request handling
- `Request` / `Response` - 请求/响应对象 / Request/Response objects
- `Headers` - HTTP 头处理 / HTTP header handling
- `URL` / `URLSearchParams` - URL 解析 / URL parsing
- `WebSocket` - WebSocket 连接 / WebSocket connections
- `crypto` (Web Crypto API) - 加密操作 / Cryptographic operations
- `TextEncoder` / `TextDecoder` - 文本编码 / Text encoding
- `atob` / `btoa` - Base64 编解码 / Base64 encoding/decoding
- `ReadableStream` / `WritableStream` - 流处理 / Stream handling
- `Cache API` - 缓存操作 / Cache operations
- `Cookies` - Cookie 操作 / Cookie operations

### EventContext 对象 / EventContext Object

EdgeOne Pages 的 Function Handlers 接收 EventContext 对象：

EdgeOne Pages Function Handlers receive an EventContext object:

```javascript
export async function onRequest(context) {
  const { request, env, params, waitUntil } = context;
  
  // request: HTTP 请求对象 / HTTP request object
  // env: 环境变量和 KV 绑定 / Environment variables and KV bindings
  // params: 动态路由参数 / Dynamic route parameters
  // waitUntil: 延长函数生命周期 / Extend function lifecycle
  
  // 获取 GEO 信息 / Get GEO information
  const geo = context.request.eo;
  
  return new Response('Hello');
}
```

### 重要差异 / Important Differences ⚠️

**EdgeOne Pages 不支持 / EdgeOne Pages Does NOT Support:**

1. **addEventListener** - 使用 Function Handlers 代替 / Use Function Handlers instead
   ```javascript
   // ❌ Cloudflare Workers 方式 / Cloudflare Workers way
   addEventListener('fetch', event => {
     event.respondWith(handleRequest(event.request));
   });
   
   // ✅ EdgeOne Pages 方式 / EdgeOne Pages way
   export async function onRequest(context) {
     return handleRequest(context.request);
   }
   ```

2. **fetch 访问 EdgeOne 缓存** - 本地调试环境不支持 / Not supported in local debugging

### KV 存储兼容性 / KV Storage Compatibility ✅

EdgeOne Pages 提供与 Cloudflare KV 兼容的键值存储 API：

EdgeOne Pages provides a KV storage API compatible with Cloudflare KV:

```javascript
// 读取 / Read
await env.kv.get(key)
await env.kv.get(key, 'json')

// 写入 / Write
await env.kv.put(key, value)
await env.kv.put(key, value, { expirationTtl: 3600 })

// 删除 / Delete
await env.kv.delete(key)

// 列表 / List
await env.kv.list({ prefix: 'prefix_' })
```

### 环境变量 / Environment Variables ✅

环境变量在两个平台上使用相同的方式：

Environment variables work the same way on both platforms:

```javascript
const uuid = env.UUID;
const password = env.TR_PASS;
```

## 使用限制 / Usage Limitations

### EdgeOne Pages 平台限制 / EdgeOne Pages Platform Limits

| 限制项 / Limit | 值 / Value | 说明 / Description |
|---------------|-----------|-------------------|
| **代码包大小** / Code Size | 5 MB | 单个函数代码包最大限制 / Max size per function |
| **请求 Body 大小** / Request Body | 1 MB | 客户端请求体最大限制 / Max client request body |
| **CPU 时间** / CPU Time | 200 ms | 单次执行 CPU 时间片（不含 I/O）/ CPU time per execution (excluding I/O) |
| **开发语言** / Language | JavaScript | ES2023+ 标准 / ES2023+ standard |

### BPB Worker Panel 兼容性分析 / Compatibility Analysis

✅ **代码包大小 / Code Size**: ~244 KB（远小于 5 MB 限制）/ Well under 5 MB limit

✅ **请求 Body** / Request Body: 主要处理配置和订阅请求，远小于 1 MB / Mainly config and subscription requests, well under 1 MB

✅ **CPU 时间** / CPU Time: 200ms 足够处理代理配置生成 / 200ms is sufficient for proxy config generation

✅ **开发语言** / Language: 使用 TypeScript 编译为 ES2023+ JavaScript / Uses TypeScript compiled to ES2023+ JavaScript

## 性能对比 / Performance Comparison

| 指标 / Metric | Cloudflare Workers | EdgeOne Pages |
|--------------|-------------------|---------------|
| 冷启动时间 / Cold Start | ~5-10ms | ~5-15ms |
| 全球边缘节点 / Global Edge Nodes | 300+ | 2000+ |
| 中国大陆节点 / China Mainland Nodes | 有限 / Limited | ⚡ 优化 / Optimized |
| 每日免费请求 / Daily Free Requests | 100,000 | 根据套餐 / By Plan |
| CPU 时间限制 / CPU Time Limit | 10ms (免费) / 10ms (free) | **200ms** (标准) / 200ms (standard) |
| 代码包大小限制 / Code Size Limit | 1 MB (免费) / 1 MB (free) | **5 MB** |

## 部署差异 / Deployment Differences

### Cloudflare Workers

```bash
# 使用 Wrangler CLI
wrangler deploy
```

### EdgeOne Pages

```bash
# 使用 EdgeOne CLI
npm run deploy:edgeone
# 或手动上传到控制台
# Or manually upload via console
```

## 已知限制 / Known Limitations

### EdgeOne Pages 特定限制 / EdgeOne Pages Specific Limitations

1. **代码包大小 / Code Package Size**
   - 最大：5 MB（未压缩）
   - Maximum: 5 MB (uncompressed)
   - 当前构建大小约 0.24 MB ✅
   - Current build size is ~0.24 MB ✅

2. **请求超时 / Request Timeout**
   - 标准：30 秒
   - Standard: 30 seconds
   - 企业版：60 秒
   - Enterprise: 60 seconds

3. **内存限制 / Memory Limit**
   - 标准：128 MB
   - Standard: 128 MB
   - 企业版：256 MB
   - Enterprise: 256 MB

4. **CPU 时间 / CPU Time**
   - 标准：50ms
   - Standard: 50ms
   - 企业版：200ms
   - Enterprise: 200ms

### 共同限制 / Common Limitations

两个平台都不支持：
Both platforms do not support:

- 文件系统访问 / File system access
- 原生模块 / Native modules
- 长时间运行的进程 / Long-running processes
- UDP 协议（Workers 限制）/ UDP protocol (Workers limitation)

## 迁移建议 / Migration Recommendations

### 从 Cloudflare 迁移到 EdgeOne / Migrating from Cloudflare to EdgeOne

1. **导出 KV 数据 / Export KV Data**
   ```bash
   # 使用 Wrangler 导出
   # Export using Wrangler
   wrangler kv:key list --namespace-id=<ID>
   ```

2. **配置环境变量 / Configure Environment Variables**
   - 在 EdgeOne 控制台设置所有环境变量
   - Set all environment variables in EdgeOne console

3. **上传代码 / Upload Code**
   - 使用 `npm run build` 构建
   - Build using `npm run build`
   - 上传 `dist/worker.js` 到 EdgeOne
   - Upload `dist/worker.js` to EdgeOne

4. **导入 KV 数据 / Import KV Data**
   - 使用 EdgeOne API 或控制台导入数据
   - Import data using EdgeOne API or console

### 反向迁移 / Reverse Migration

从 EdgeOne 迁移回 Cloudflare 的步骤类似。

Steps for migrating back from EdgeOne to Cloudflare are similar.

## 测试建议 / Testing Recommendations

在生产环境部署前，建议测试以下功能：

Before production deployment, test the following features:

1. ✅ 面板登录 / Panel login
2. ✅ VLESS 配置生成 / VLESS config generation
3. ✅ Trojan 配置生成 / Trojan config generation
4. ✅ Warp 配置生成 / Warp config generation
5. ✅ DNS-over-HTTPS 查询 / DNS-over-HTTPS queries
6. ✅ WebSocket 连接 / WebSocket connections
7. ✅ KV 存储读写 / KV storage read/write

## 技术支持 / Technical Support

### EdgeOne 资源 / EdgeOne Resources

- [EdgeOne 文档](https://cloud.tencent.com/document/product/1552)
- [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
- [EdgeOne API 文档](https://cloud.tencent.com/document/api/1552)

### Cloudflare 资源 / Cloudflare Resources

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)

## 总结 / Summary

BPB Worker Panel 完全兼容 EdgeOne Pages 平台。由于两个平台使用相同的标准 API，无需修改代码即可部署。EdgeOne Pages 在中国大陆有更好的性能表现，适合主要用户在中国的场景。

BPB Worker Panel is fully compatible with EdgeOne Pages platform. Since both platforms use the same standard APIs, no code modifications are required for deployment. EdgeOne Pages offers better performance in mainland China, making it suitable for scenarios where the primary users are in China.
