@echo off
REM 启动FastAPI服务 (Windows)

REM 检查是否安装了依赖
if not exist "venv" (
    echo 创建虚拟环境...
    python -m venv venv
)

REM 激活虚拟环境
venv\Scripts\Activate.ps1

REM 安装依赖
echo 安装依赖...
pip install -r requirements.txt

REM 启动服务
echo 启动服务...
uvicorn main:app --reload --host 0.0.0.0 --port 8000

