#!/usr/bin/env node

/**
 * EdgeOne Pages 部署脚本 / EdgeOne Pages Deployment Script
 * 
 * 此脚本帮助将 BPB Worker Panel 部署到腾讯云 EdgeOne Pages
 * This script helps deploy BPB Worker Panel to Tencent Cloud EdgeOne Pages
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 EdgeOne Pages 部署准备 / EdgeOne Pages Deployment Preparation\n');

// 检查构建产物 / Check build artifacts
const distPath = path.join(__dirname, '..', 'dist', 'worker.js');
if (!fs.existsSync(distPath)) {
    console.error('❌ 错误：找不到构建产物 / Error: Build artifact not found');
    console.error('   请先运行：npm run build / Please run: npm run build');
    process.exit(1);
}

console.log('✅ 构建产物已找到 / Build artifact found');

// 检查配置文件 / Check configuration file
const configPath = path.join(__dirname, '..', 'edgeone.config.json');
if (!fs.existsSync(configPath)) {
    console.error('❌ 错误：找不到 EdgeOne 配置文件 / Error: EdgeOne config file not found');
    process.exit(1);
}

console.log('✅ EdgeOne 配置文件已找到 / EdgeOne config file found');

// 读取并显示配置 / Read and display configuration
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
console.log('\n📋 当前配置 / Current Configuration:');
console.log(JSON.stringify(config, null, 2));

// 显示部署说明 / Display deployment instructions
console.log('\n📝 部署步骤 / Deployment Steps:\n');
console.log('方式一 / Method 1: 使用 EdgeOne CLI / Using EdgeOne CLI');
console.log('  1. 安装 CLI / Install CLI:');
console.log('     npm install -g @tencent/edgeone-cli');
console.log('  2. 登录 / Login:');
console.log('     edgeone-cli login');
console.log('  3. 部署 / Deploy:');
console.log('     edgeone-cli deploy --config edgeone.config.json\n');

console.log('方式二 / Method 2: 手动部署 / Manual Deployment');
console.log('  1. 访问 EdgeOne 控制台 / Visit EdgeOne Console:');
console.log('     https://console.cloud.tencent.com/edgeone');
console.log('  2. 创建边缘函数 / Create Edge Function');
console.log('  3. 上传文件 / Upload file: dist/worker.js');
console.log('  4. 配置 KV 绑定和环境变量 / Configure KV binding and environment variables');
console.log('  5. 设置路由 / Set routes: /*\n');

console.log('📚 详细文档 / Detailed Documentation:');
console.log('   查看 EDGEONE_DEPLOYMENT.md / See EDGEONE_DEPLOYMENT.md\n');

// 检查文件大小 / Check file size
const stats = fs.statSync(distPath);
const fileSizeInMB = stats.size / (1024 * 1024);
console.log(`📦 构建产物大小 / Build size: ${fileSizeInMB.toFixed(2)} MB`);

if (fileSizeInMB > 5) {
    console.warn('⚠️  警告：文件较大，可能超出 EdgeOne 限制');
    console.warn('   Warning: File is large, may exceed EdgeOne limits');
}

console.log('\n✨ 准备完成！/ Preparation complete!');
console.log('💡 提示：请确保在 EdgeOne 控制台配置环境变量');
console.log('   Tip: Make sure to configure environment variables in EdgeOne console\n');
