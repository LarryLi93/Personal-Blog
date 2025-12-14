# 访问计数后端服务

这是一个使用 FastAPI 和 Redis 实现的网站访问计数服务。

## 安装依赖

```bash
pip install -r requirements.txt
```

## 运行服务

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API 接口

### 获取访问次数
- **GET** `/api/visit-count`
- 返回当前访问次数

### 增加访问次数
- **GET** `/api/visit-count/increment`
- **POST** `/api/visit-count/increment`
- 增加访问次数并返回新的计数

## 环境配置

Redis 服务器地址：`43.153.150.156:6379`

如果需要修改 Redis 配置，请编辑 `main.py` 中的 `redis_client` 配置。

