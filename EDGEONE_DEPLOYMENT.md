# EdgeOne Pages 部署指南 / EdgeOne Pages Deployment Guide

[中文](#中文版本) | [English](#english-version)

---

## 中文版本

### 什么是 EdgeOne Pages？

**EdgeOne Pages** (pages.edgeone.ai) 是腾讯云提供的全栈开发平台，集成了：
- 静态网站托管
- **边缘函数**（Edge Functions）- 基于文件路由系统
- KV 键值存储
- 自动化 CI/CD

**与 Cloudflare Pages 的对比：**

| 特性 | EdgeOne Pages | Cloudflare Pages |
|------|--------------|------------------|
| 边缘函数 | 基于 `/edge-functions` 目录的文件路由 | 基于 `_worker.js` 或 `/functions` 目录 |
| KV 存储 | ✅ 支持 | ✅ 支持 |
| WebSocket | ✅ 支持 | ✅ 支持 |
| 部署方式 | Git 集成或 CLI | Git 集成或 Wrangler CLI |
| 中国访问 | ⚡ 优化 | 🐌 较慢 |

**BPB Worker Panel 在 EdgeOne Pages 的部署方式：**

EdgeOne Pages 使用基于文件的路由系统。项目已配置 `edge-functions/[[path]].js` 作为通配符路由，捕获所有请求并转发到主 Worker。

### 部署步骤

#### 1. 准备工作

1. 访问 [EdgeOne Pages 官网](https://pages.edgeone.ai/) 注册账号
2. 在本地构建项目：
   ```bash
   git clone https://github.com/bia-pain-bache/BPB-Worker-Panel.git
   cd BPB-Worker-Panel
   npm install
   npm run build
   ```
3. 构建完成后，`dist/worker.js` 文件将用于部署

#### 2. 创建 EdgeOne Pages 项目

1. 登录 [EdgeOne Pages 控制台](https://pages.edgeone.ai/)
2. 点击"创建项目"
3. 选择项目类型：**边缘函数项目**
4. 输入项目名称（如：`bpb-worker-panel`）

#### 3. 创建 KV 命名空间

1. 在 EdgeOne Pages 控制台，进入您的项目
2. 导航到 **设置** -> **KV 存储**
3. 点击"创建 KV 命名空间"
4. 命名空间名称：`bpb-kv`
5. 创建后，记录绑定变量名（默认为 `kv`）

> **重要**：KV 命名空间用于存储面板配置、用户设置、Warp 配置等数据

#### 4. 配置环境变量

在 EdgeOne Pages 项目设置中配置以下环境变量：

**必需变量：**

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `UUID` | VLESS 用户 ID（用于身份验证） | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `TR_PASS` | Trojan 密码（用于身份验证） | `mypassword123` |

**可选变量：**

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `SUB_PATH` | 订阅路径 | UUID 值 |
| `FALLBACK` | 回退域名（当主域名被封时使用） | 无 |
| `DOH_URL` | DNS over HTTPS 服务器 | `https://cloudflare-dns.com/dns-query` |
| `PROXY_IP` | 代理 IP 地址列表（逗号分隔） | 无 |
| `PREFIX` | NAT64 前缀列表（逗号分隔） | 无 |

> **提示**：可使用在线 UUID 生成器生成 UUID，Trojan 密码建议使用强密码

#### 5. 部署边缘函数

EdgeOne Pages 支持三种部署方式：

##### 方式一：Git 集成部署（最推荐）

1. 将代码推送到 GitHub/GitLab/Gitee 仓库
2. 在 EdgeOne Pages 控制台连接您的 Git 仓库
3. 配置构建设置：
   - **构建命令**: `npm run build`
   - **输出目录**: `dist`
   - **函数目录**: `edge-functions`
4. EdgeOne Pages 会自动构建和部署
5. 每次推送代码时自动重新部署

> **优势**：自动化 CI/CD，支持回滚，适合团队协作

##### 方式二：使用 EdgeOne CLI 部署

```bash
# 安装 EdgeOne CLI
npm install -g edgeone

# 在项目目录下启动本地开发服务器（用于调试）
edgeone pages dev

# 登录到 EdgeOne Pages
edgeone pages login

# 部署到 EdgeOne Pages
edgeone pages deploy
```

> **优势**：快速部署，支持本地调试

##### 方式三：控制台手动上传（不推荐）

1. 在本地构建项目：`npm run build`
2. 在 EdgeOne Pages 控制台进入项目
3. 上传整个项目目录（包含 `dist/` 和 `edge-functions/`）
4. 配置 KV 绑定和环境变量

> **说明**：手动上传适合快速测试，生产环境建议使用 Git 部署

#### 6. 本地调试

EdgeOne Pages 提供本地开发环境：

```bash
# 安装 EdgeOne CLI
npm install -g edgeone

# 启动本地开发服务器
edgeone pages dev

# 访问本地服务器
# http://localhost:8788
```

**注意事项：**
- 本地调试环境不支持使用 fetch 访问 EdgeOne 节点缓存
- KV 存储需要在本地配置模拟数据或连接远程 KV

#### 7. 配置路由

EdgeOne Pages 基于 `/edge-functions` 目录自动生成路由：

| 文件路径 | 访问路由 | 说明 |
|---------|---------|------|
| `/edge-functions/[[path]].js` | `/*` (所有路径) | BPB Panel 使用此通配符路由 |
| `/edge-functions/index.js` | `/` (根路径) | 如需自定义首页可创建此文件 |

#### 8. 访问测试

部署成功后，通过以下路径访问：

- 面板：`https://your-project.pages.edgeone.ai/panel`
- 订阅：`https://your-project.pages.edgeone.ai/sub/normal/{SUB_PATH}`
- DNS查询：`https://your-project.pages.edgeone.ai/dns-query/{SUB_PATH}`
- WebSocket：`wss://your-project.pages.edgeone.ai/` (自动支持)

> 将 `your-project` 替换为您的项目名称

**绑定自定义域名：**
1. 在项目设置中点击"自定义域名"
2. 添加您的域名
3. 配置 CNAME 记录指向 EdgeOne Pages
4. 等待 SSL 证书自动签发

### 注意事项

1. **文件路由系统**：EdgeOne Pages 使用 `/edge-functions` 目录的文件路由，BPB Panel 已配置 `[[path]].js` 通配符
2. **KV 绑定**：确保 KV 命名空间绑定名称为 `kv`
3. **环境变量**：在项目设置中配置，代码中通过 `env.VARIABLE_NAME` 访问
4. **代码大小限制**：5 MB（当前构建 ~244 KB，无问题）
5. **CPU 时间限制**：200 ms 每次执行（足够 BPB Panel 使用）
6. **请求 Body 限制**：1 MB（足够配置请求使用）
7. **不支持 addEventListener**：使用 Function Handlers (`onRequest` 等) 代替

### 常见问题

#### Q: EdgeOne Pages 和 Cloudflare Workers 有什么区别？

A: 两者在功能上类似，但 EdgeOne Pages 是腾讯云的服务，主要面向中国市场，在中国大陆有更好的访问速度。

#### Q: 如何更新部署的代码？

A: 重新构建项目并通过控制台或 CLI 重新部署即可。

#### Q: KV 数据如何迁移？

A: 目前需要手动导出 Cloudflare KV 数据，然后通过 API 导入到 EdgeOne KV。

---

## English Version

### What is EdgeOne Pages?

**EdgeOne Pages** (pages.edgeone.ai) is Tencent Cloud's edge computing platform, similar to Cloudflare Pages, integrating static website hosting and Edge Functions.

**Platform Features:**
- ✅ 2000+ global edge nodes
- ✅ Supports Edge Functions
- ✅ Compatible with Service Worker API
- ✅ Built-in KV key-value storage
- ✅ Supports WebSocket connections
- ✅ Optimized access speed in mainland China

**BPB Worker Panel Deployment:**
Since BPB Worker Panel is a purely dynamic application (no static files), we will deploy using EdgeOne Pages' **Edge Functions** capability.

### Deployment Steps

#### 1. Prerequisites

1. Visit [EdgeOne Pages](https://pages.edgeone.ai/) and register an account
2. Build the project locally:
   ```bash
   git clone https://github.com/bia-pain-bache/BPB-Worker-Panel.git
   cd BPB-Worker-Panel
   npm install
   npm run build
   ```
3. After building, the `dist/worker.js` file will be used for deployment

#### 2. Create EdgeOne Pages Project

1. Login to [EdgeOne Pages Console](https://pages.edgeone.ai/)
2. Click "Create Project"
3. Select project type: **Edge Functions Project**
4. Enter project name (e.g., `bpb-worker-panel`)

#### 3. Create KV Namespace

1. In EdgeOne Pages console, enter your project
2. Navigate to **Settings** -> **KV Storage**
3. Click "Create KV Namespace"
4. Namespace name: `bpb-kv`
5. After creation, note the binding variable name (default is `kv`)

> **Important**: KV namespace stores panel configuration, user settings, Warp configs, and other data

#### 4. Configure Environment Variables

Configure the following environment variables in EdgeOne Pages project settings:

**Required Variables:**

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `UUID` | VLESS user ID (for authentication) | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `TR_PASS` | Trojan password (for authentication) | `mypassword123` |

**Optional Variables:**

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `SUB_PATH` | Subscription path | UUID value |
| `FALLBACK` | Fallback domain (when main domain is blocked) | None |
| `DOH_URL` | DNS over HTTPS server | `https://cloudflare-dns.com/dns-query` |
| `PROXY_IP` | Proxy IP addresses (comma-separated) | None |
| `PREFIX` | NAT64 prefixes (comma-separated) | None |

> **Tip**: Use an online UUID generator for UUID, and use a strong password for Trojan

#### 5. Deploy Edge Function

##### Method 1: Deploy via EdgeOne Pages Console

1. In project console, go to **Functions** tab
2. Click "Upload Function Code"
3. Upload `dist/worker.js` file
4. Confirm function configuration:
   - Entry file: `worker.js`
   - KV binding: Ensure KV namespace is bound (variable name: `kv`)
5. Click "Deploy"

##### Method 2: Use EdgeOne Pages CLI (Recommended)

```bash
# Install EdgeOne Pages CLI
npm install -g @edgeone/cli

# Login
edgeone-pages login

# Deploy
npm run deploy:edgeone
```

> **Note**: CLI deployment automatically reads the `edgeone.config.json` configuration file

#### 6. Configure Routes

EdgeOne Pages automatically configures routes for your function. By default:
- Main route: `/*` is handled by the function
- Custom domain: Can be bound in project settings

#### 7. Access Testing

After successful deployment, access via:

- Panel: `https://your-project.pages.edgeone.ai/panel`
- Subscription: `https://your-project.pages.edgeone.ai/sub/normal/{SUB_PATH}`
- DNS Query: `https://your-project.pages.edgeone.ai/dns-query/{SUB_PATH}`

> Replace `your-project` with your actual project name

### Important Notes

1. **KV Binding**: Ensure KV namespace binding name is `kv`
2. **Environment Variables**: All environment variables must be configured in EdgeOne console
3. **Compatibility Flag**: Must enable `nodejs_compat` flag to support Node.js runtime APIs
4. **Code Size**: EdgeOne Pages has code package size limits
5. **Request Limits**: Be aware of EdgeOne's request frequency and concurrency limits
6. **Cost**: EdgeOne service is billed by usage, monitor costs carefully

### FAQ

#### Q: What's the difference between EdgeOne Pages and Cloudflare Workers?

A: They are functionally similar, but EdgeOne Pages is Tencent Cloud's service targeting the Chinese market with better access speeds in mainland China.

#### Q: How to update deployed code?

A: Rebuild the project and redeploy via console or CLI.

#### Q: How to migrate KV data?

A: Currently requires manual export from Cloudflare KV and import to EdgeOne KV via API.

---

## 技术支持 / Technical Support

如有问题，请在 GitHub 提交 Issue。

For issues, please submit on GitHub.
