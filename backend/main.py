from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import redis
from pydantic import BaseModel
import uvicorn
import logging
from typing import Optional

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# 配置CORS，允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 连接Redis
redis_client = redis.Redis(
    host='43.153.150.156',
    port=6379,
    db=0,
    decode_responses=True
)

# 访问人数的键名
VISITOR_COUNT_KEY = "website:visitor_count"
# 访问用户集合键名（用于去重）
VISITORS_SET_KEY = "website:visitors"


class VisitCountResponse(BaseModel):
    count: int


@app.get("/")
def read_root():
    return {"message": "Visit Counter API"}


@app.get("/api/visit-count", response_model=VisitCountResponse)
def get_visitor_count():
    """获取当前访问人数"""
    count = redis_client.get(VISITOR_COUNT_KEY)
    if count is None:
        count = 0
    else:
        count = int(count)
    return VisitCountResponse(count=count)


@app.post("/api/visit-count/increment", response_model=VisitCountResponse)
def increment_visitor_count(user_id: Optional[str] = None):
    """增加访问人数并返回新的计数（基于用户ID去重）"""
    try:
        # 如果没有提供用户ID，直接增加计数（兼容旧版本）
        if not user_id:
            count = redis_client.incr(VISITOR_COUNT_KEY)
            return VisitCountResponse(count=count)
        
        # 检查用户是否已经访问过
        if redis_client.sismember(VISITORS_SET_KEY, user_id):
            # 用户已经访问过，只返回当前计数
            count = redis_client.get(VISITOR_COUNT_KEY)
            if count is None:
                count = 0
            else:
                count = int(count)
            return VisitCountResponse(count=count)
        
        # 新用户，添加到访问集合并增加计数
        redis_client.sadd(VISITORS_SET_KEY, user_id)
        count = redis_client.incr(VISITOR_COUNT_KEY)
        logger.info(f"New visitor {user_id} added. Total visitors: {count}")
        return VisitCountResponse(count=count)
    except redis.RedisError as e:
        logger.error(f"Redis error: {e}")
        raise HTTPException(status_code=500, detail=f"Redis操作失败: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"服务器错误: {str(e)}")


@app.get("/api/visit-count/increment", response_model=VisitCountResponse)
def increment_visitor_count_get(user_id: Optional[str] = None):
    """GET方法增加访问人数（方便前端调用）"""
    return increment_visitor_count(user_id)


def main():
    """主函数，用于启动FastAPI服务器"""
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # 开发模式下自动重载
    )


if __name__ == "__main__":
    main()
