# EdgeOne Pages 快速开始 / EdgeOne Pages Quick Start

> 5分钟内完成部署 / Deploy in 5 minutes

## 中文快速指南

### 第一步：构建项目

```bash
git clone https://github.com/bia-pain-bache/BPB-Worker-Panel.git
cd BPB-Worker-Panel
npm install
npm run build
```

### 第二步：注册 EdgeOne Pages

1. 访问 [EdgeOne Pages](https://pages.edgeone.ai/)
2. 注册/登录账号
3. 创建新项目（选择"边缘函数项目"）

### 第三步：创建 KV 存储

1. 在项目设置中，进入"KV 存储"
2. 创建命名空间，名称如：`bpb-kv`
3. 绑定变量名设置为：`kv`

### 第四步：上传代码

1. 在项目"函数"页面，点击"上传代码"
2. 上传文件：`dist/worker.js`
3. 入口文件设置为：`worker.js`

### 第五步：绑定 KV

确认在项目设置中，KV 命名空间已绑定：
- 变量名：`kv`
- 命名空间：选择刚才创建的 `bpb-kv`

### 第六步：设置环境变量

在"环境变量"部分添加：

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| UUID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | VLESS UUID |
| TR_PASS | `mypassword123` | Trojan 密码 |

### 第七步：部署

点击"部署"按钮，等待部署完成

### 第八步：测试

访问：`https://your-project.pages.edgeone.ai/panel`

---

## English Quick Guide

### Step 1: Build Project

```bash
git clone https://github.com/bia-pain-bache/BPB-Worker-Panel.git
cd BPB-Worker-Panel
npm install
npm run build
```

### Step 2: Prepare EdgeOne

1. Visit [EdgeOne Console](https://console.cloud.tencent.com/edgeone)
2. Create a site (if you haven't)
3. Go to "Edge Functions" -> "Function Management"
4. Click "Create Function"

### Step 3: Create KV Storage

1. In EdgeOne console, go to "Edge Functions" -> "KV Storage"
2. Create namespace, name it: `bpb-kv`
3. Note the namespace ID

### Step 4: Upload Code

1. In function management page, select "Upload Code Package"
2. Upload file: `dist/worker.js`
3. Function name: `bpb-worker`
4. Runtime: Node.js

### Step 5: Bind KV

1. In function details page, click "Environment" tab
2. In "KV Namespace Binding" section:
   - Variable name: `kv`
   - Select the KV namespace you just created

### Step 6: Set Environment Variables

Add in "Environment Variables" section:

| Variable | Example | Description |
|----------|---------|-------------|
| UUID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | VLESS UUID |
| TR_PASS | `mypassword123` | Trojan password |

### Step 7: Configure Routes

1. In site settings, go to "Rules Engine"
2. Add rule:
   - Match: `/*` (all paths)
   - Action: Trigger function
   - Select your function: `bpb-worker`

### Step 8: Test

Visit: `https://your-domain.com/panel`

---

## 使用 CLI 部署 / Deploy with CLI

更快的方式：Use the faster way:

```bash
npm run build
npm run deploy:edgeone
```

按照提示完成部署。

Follow the prompts to complete deployment.

---

## 常见问题 / Common Issues

### ❌ 错误：500 Internal Server Error

**原因 / Cause**: KV 未绑定或环境变量缺失

**解决 / Solution**: 
1. 检查 KV 绑定名称必须是 `kv`
2. 确保 UUID 和 TR_PASS 已设置

### ❌ 错误：404 Not Found

**原因 / Cause**: 路由未配置

**解决 / Solution**: 
在规则引擎中添加 `/*` 路由规则

### ❌ 错误：Code package too large

**原因 / Cause**: 代码包超过 5MB

**解决 / Solution**: 
当前构建只有 ~0.24MB，应该不会遇到此问题。如果遇到，请检查是否上传了 node_modules

---

## 获取帮助 / Get Help

- 📖 完整文档：[EDGEONE_DEPLOYMENT.md](EDGEONE_DEPLOYMENT.md)
- 🔧 兼容性说明：[EDGEONE_COMPATIBILITY.md](EDGEONE_COMPATIBILITY.md)
- 💬 GitHub Issues: [提交问题](https://github.com/bia-pain-bache/BPB-Worker-Panel/issues)
