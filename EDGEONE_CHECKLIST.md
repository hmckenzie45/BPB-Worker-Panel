# EdgeOne Pages 部署检查清单 / EdgeOne Pages Deployment Checklist

## 必需文件 / Required Files

### ✅ 1. Edge Function 路由文件 / Edge Function Route Handler
```
edge-functions/[[path]].js
```
- 通配符路由，捕获所有请求
- 调用主 Worker 的 fetch 处理器

### ✅ 2. 构建的 Worker 代码 / Built Worker Code
```
dist/worker.js
```
- 主应用逻辑
- 由 `npm run build` 生成
- **必须先构建才能部署！**

### ✅ 3. 项目配置文件 / Project Configuration
```
edgeone.config.json
```
- 构建命令
- KV 存储绑定
- 环境变量

## 部署步骤 / Deployment Steps

### 方式一：Git 集成（推荐） / Method 1: Git Integration (Recommended)

1. **构建项目 / Build Project**
   ```bash
   npm install
   npm run build
   ```

2. **推送到 Git / Push to Git**
   ```bash
   git add .
   git commit -m "Add EdgeOne Pages support"
   git push
   ```

3. **在 EdgeOne 控制台配置 / Configure in EdgeOne Console**
   - 连接 Git 仓库
   - 设置构建命令: `npm run build`
   - 设置输出目录: `./`
   - 配置环境变量
   - 绑定 KV 存储

### 方式二：EdgeOne CLI / Method 2: EdgeOne CLI

1. **安装 EdgeOne CLI**
   ```bash
   npm install -g edgeone
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署**
   ```bash
   edgeone pages deploy
   ```

### 方式三：控制台上传 / Method 3: Console Upload

1. **构建项目**
   ```bash
   npm run build
   ```

2. **打包必要文件**
   - `edge-functions/` 目录
   - `dist/worker.js` 文件
   - `edgeone.config.json` 文件
   - `package.json` 文件（用于依赖信息）

3. **上传到 EdgeOne Pages 控制台**

## 环境变量配置 / Environment Variables

必须在 EdgeOne Pages 控制台配置以下环境变量：

```bash
# KV 命名空间绑定
kv = "your-kv-namespace-id"

# 可选：其他环境变量
# 根据你的配置需求添加
```

## KV 存储配置 / KV Storage Configuration

1. 在 EdgeOne Pages 控制台创建 KV 命名空间
2. 将 KV 命名空间 ID 绑定到 `kv` 变量
3. EdgeOne Pages 的 KV API 与 Cloudflare KV 完全兼容

## 验证部署 / Verify Deployment

部署成功后，访问以下路径验证：

```
https://your-domain.edgeone.app/panel
https://your-domain.edgeone.app/login
```

## 常见问题 / Troubleshooting

### ❌ 错误：找不到 dist/worker.js
**解决方案**: 运行 `npm run build`

### ❌ 错误：KV 未定义
**解决方案**: 在 EdgeOne Pages 控制台配置 KV 绑定

### ❌ 错误：路由不工作
**解决方案**: 确认 `edge-functions/[[path]].js` 文件存在

### ❌ 错误：代码包太大
**解决方案**: 当前代码包约 244 KB，远小于 5 MB 限制，不应出现此问题

## 最小部署文件列表 / Minimal Deployment Files

```
project-root/
├── edge-functions/
│   └── [[path]].js          # ✅ 必需
├── dist/
│   └── worker.js             # ✅ 必需（构建生成）
├── edgeone.config.json       # ✅ 推荐
├── package.json              # ✅ 推荐（用于依赖信息）
└── .edgeonerc                # ⚠️ 可选（CLI 配置）
```

## 回答你的问题 / Answer to Your Question

**问：只需要一个 edge-functions/[[path]].js 就可以运行吗？**

**答：不够！需要以下文件：**

1. ✅ `edge-functions/[[path]].js` - 路由处理器
2. ✅ `dist/worker.js` - 主应用代码（必须先 `npm run build`）
3. ✅ `edgeone.config.json` - 配置文件
4. ✅ EdgeOne 控制台的 KV 绑定配置

**最简部署流程：**
```bash
# 1. 构建
npm run build

# 2. 确保有这些文件
# - edge-functions/[[path]].js
# - dist/worker.js
# - edgeone.config.json

# 3. 部署（选择一种方式）
# 方式 A: Git 推送后在控制台配置
# 方式 B: edgeone pages deploy
# 方式 C: 控制台手动上传

# 4. 在控制台配置 KV 绑定
```

## 更多信息 / More Information

详细部署指南请参考：
- [完整部署文档 / Full Deployment Guide](EDGEONE_DEPLOYMENT.md)
- [快速开始指南 / Quick Start Guide](EDGEONE_QUICKSTART.md)
- [兼容性说明 / Compatibility Guide](EDGEONE_COMPATIBILITY.md)
