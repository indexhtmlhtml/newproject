#!/bin/bash

# 终止可能已经运行的 Node.js 进程
pkill -f "node server/server.js" || true

# 等待端口释放
sleep 2

# 启动后端服务器
node server/server.js &

# 等待后端服务器启动
sleep 3

# 启动前端开发服务器
npm run dev 