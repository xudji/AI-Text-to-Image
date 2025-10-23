#!/bin/bash

echo "🚀 启动AI图片生成代理服务器..."
echo

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查是否设置了API Key
if [ -z "$DASHSCOPE_API_KEY" ]; then
    echo "❌ 错误: 未设置DASHSCOPE_API_KEY环境变量"
    echo "请设置您的阿里云DashScope API Key"
    echo "示例: export DASHSCOPE_API_KEY=sk-your-api-key-here"
    exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install express cors axios
fi

# 启动代理服务器
echo "🎯 启动代理服务器..."
echo "📡 API Key: ${DASHSCOPE_API_KEY:0:10}..."
echo "🌐 服务地址: http://localhost:8080"
echo

node proxy-server.js
