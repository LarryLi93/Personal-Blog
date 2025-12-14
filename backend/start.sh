#!/bin/bash

# 启动FastAPI服务（后台运行）

# 检查端口8000是否被占用，杀死占用进程
echo "检查端口8000是否被占用..."
PID=$(lsof -ti:8000 2>/dev/null)
if [ ! -z "$PID" ]; then
    echo "发现占用端口8000的进程(PID: $PID)，正在停止..."
    kill -9 $PID 2>/dev/null
    sleep 2
fi

# 检查是否安装了依赖
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装依赖..."
pip install -r requirements.txt

# 启动服务（后台运行）
echo "启动服务（后台运行）..."
nohup uvicorn main:app --reload --host 0.0.0.0 --port 8000 > backend.log 2>&1 &

# 显示进程ID
echo "服务已在后台启动，PID: $!"
echo "日志文件: backend.log"
echo "可通过 'tail -f backend.log' 查看实时日志"