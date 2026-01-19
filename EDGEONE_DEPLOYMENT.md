# EdgeOne Pages 部署指南 / EdgeOne Pages Deployment Guide

[中文](#中文版本) | [English](#english-version)

---

## 中文版本

### 什么是 EdgeOne Pages？

EdgeOne Pages 是腾讯云 EdgeOne 提供的边缘函数服务，类似于 Cloudflare Workers/Pages，可以在全球边缘节点运行代码。

### 部署步骤

#### 1. 准备工作

1. 注册腾讯云账号并开通 EdgeOne 服务
2. 在 EdgeOne 控制台创建站点
3. 确保您已经构建了项目：
   ```bash
   npm install
   npm run build
   ```

#### 2. 创建 KV 命名空间

1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 进入您的站点 -> 边缘函数 -> KV 存储
3. 创建一个新的 KV 命名空间，记录命名空间 ID

#### 3. 配置环境变量

在 EdgeOne Pages 控制台配置以下环境变量：

| 变量名 | 说明 | 是否必需 |
|--------|------|----------|
| `UUID` | VLESS 用户 ID | 是 |
| `TR_PASS` | Trojan 密码 | 是 |
| `SUB_PATH` | 订阅路径（默认为 UUID） | 否 |
| `FALLBACK` | 回退域名 | 否 |
| `DOH_URL` | DNS over HTTPS URL | 否 |
| `PROXY_IP` | 代理 IP 地址列表（逗号分隔） | 否 |
| `PREFIX` | IP 前缀列表（逗号分隔） | 否 |

#### 4. 部署方式

##### 方式一：通过 EdgeOne 控制台部署

1. 进入 EdgeOne 控制台 -> 边缘函数
2. 点击"创建函数"
3. 选择"上传代码包"
4. 上传 `dist/worker.js` 文件
5. 在函数配置中：
   - **运行时兼容性**：启用 `nodejs_compat` 标志（必需，用于 Node.js API 兼容）
   - 绑定 KV 命名空间（绑定名称：`kv`）
   - 配置环境变量
   - 设置触发路由

##### 方式二：使用 EdgeOne CLI（推荐）

```bash
# 安装 EdgeOne CLI
npm install -g @tencent/edgeone-cli

# 登录
edgeone-cli login

# 部署
edgeone-cli deploy --config edgeone.config.json
```

#### 5. 配置路由

在 EdgeOne 控制台配置函数路由：
- 路由模式：`/*`
- 函数：选择您创建的函数

#### 6. 访问测试

部署成功后，通过以下路径访问：

- 面板：`https://your-domain.com/panel`
- 订阅：`https://your-domain.com/sub/normal/{SUB_PATH}`
- DNS查询：`https://your-domain.com/dns-query/{SUB_PATH}`

### 注意事项

1. **KV 绑定**：确保 KV 命名空间绑定名称为 `kv`
2. **环境变量**：所有环境变量需要在 EdgeOne 控制台配置
3. **兼容性标志**：必须启用 `nodejs_compat` 标志以支持 Node.js 运行时 API
4. **代码大小**：EdgeOne Pages 有代码包大小限制，请注意优化
5. **请求限制**：注意 EdgeOne 的请求频率和并发限制
5. **费用**：EdgeOne 服务按使用量计费，请注意成本控制

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

EdgeOne Pages is Tencent Cloud's edge function service, similar to Cloudflare Workers/Pages, allowing you to run code at edge nodes globally.

### Deployment Steps

#### 1. Prerequisites

1. Register a Tencent Cloud account and activate EdgeOne service
2. Create a site in EdgeOne console
3. Build the project:
   ```bash
   npm install
   npm run build
   ```

#### 2. Create KV Namespace

1. Login to [EdgeOne Console](https://console.cloud.tencent.com/edgeone)
2. Navigate to your site -> Edge Functions -> KV Storage
3. Create a new KV namespace and note the namespace ID

#### 3. Configure Environment Variables

Configure the following environment variables in EdgeOne Pages console:

| Variable | Description | Required |
|----------|-------------|----------|
| `UUID` | VLESS user ID | Yes |
| `TR_PASS` | Trojan password | Yes |
| `SUB_PATH` | Subscription path (defaults to UUID) | No |
| `FALLBACK` | Fallback domain | No |
| `DOH_URL` | DNS over HTTPS URL | No |
| `PROXY_IP` | Proxy IP addresses (comma-separated) | No |
| `PREFIX` | IP prefixes (comma-separated) | No |

#### 4. Deployment Methods

##### Method 1: Deploy via EdgeOne Console

1. Go to EdgeOne Console -> Edge Functions
2. Click "Create Function"
3. Select "Upload Code Package"
4. Upload `dist/worker.js` file
5. In function configuration:
   - **Runtime Compatibility**: Enable `nodejs_compat` flag (required for Node.js API compatibility)
   - Bind KV namespace (binding name: `kv`)
   - Configure environment variables
   - Set trigger routes

##### Method 2: Use EdgeOne CLI (Recommended)

```bash
# Install EdgeOne CLI
npm install -g @tencent/edgeone-cli

# Login
edgeone-cli login

# Deploy
edgeone-cli deploy --config edgeone.config.json
```

#### 5. Configure Routes

Configure function routes in EdgeOne console:
- Route pattern: `/*`
- Function: Select your created function

#### 6. Access Testing

After successful deployment, access via:

- Panel: `https://your-domain.com/panel`
- Subscription: `https://your-domain.com/sub/normal/{SUB_PATH}`
- DNS Query: `https://your-domain.com/dns-query/{SUB_PATH}`

### Important Notes

1. **KV Binding**: Ensure KV namespace binding name is `kv`
2. **Environment Variables**: All environment variables must be configured in EdgeOne console
3. **Compatibility Flag**: Must enable `nodejs_compat` flag to support Node.js runtime APIs
4. **Code Size**: EdgeOne Pages has code package size limits
5. **Request Limits**: Be aware of EdgeOne's request frequency and concurrency limits
5. **Cost**: EdgeOne service is billed by usage, monitor costs carefully

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
