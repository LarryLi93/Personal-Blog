#!/bin/bash

cd "$(dirname "$0")"

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装依赖..."
pip install -q -r requirements.txt

# 启动服务
echo "启动访问计数服务..."
echo "服务将运行在 http://localhost:8000"
echo "按 Ctrl+C 停止服务"
python main.py
