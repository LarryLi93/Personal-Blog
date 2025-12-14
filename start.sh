#!/bin/bash

# 启动前端Vite服务（后台运行）

# 检查端口5173是否被占用，杀死占用进程
echo "检查端口5173是否被占用..."
PID=$(lsof -ti:5173 2>/dev/null)
if [ ! -z "$PID" ]; then
    echo "发现占用端口5173的进程(PID: $PID)，正在停止..."
    kill -9 $PID 2>/dev/null
    sleep 2
fi

# 另外检查3000端口（常见备用端口）
PID2=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PID2" ]; then
    echo "发现占用端口3000的进程(PID: $PID2)，正在停止..."
    kill -9 $PID2 2>/dev/null
    sleep 2
fi

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

# 启动服务（后台运行）
echo "启动前端服务（后台运行）..."
nohup npm run dev > frontend.log 2>&1 &

# 显示进程ID
echo "前端服务已在后台启动，PID: $!"
echo "日志文件: frontend.log"
echo "可通过 'tail -f frontend.log' 查看实时日志"