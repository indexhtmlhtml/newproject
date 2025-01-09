#!/bin/bash

# 终止可能已经运行的 Node.js 进程
echo "Stopping existing Node.js processes..."
pkill -f "node server/server.js" || true

# 等待端口释放
echo "Waiting for port to be released..."
sleep 2

# 启动后端服务器
echo "Starting server..."
node server/server.js 