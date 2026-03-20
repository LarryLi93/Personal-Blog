"""
使用 SQLite 的访问计数服务
使用 Python 自带的 sqlite3 模块
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
import sqlite3
import os
from typing import Optional
from datetime import datetime
from contextlib import contextmanager

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

# 数据库文件路径
DB_PATH = os.path.join(os.path.dirname(__file__), "visit_counter.db")


@contextmanager
def get_db():
    """数据库连接的上下文管理器"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def init_db():
    """初始化数据库表"""
    with get_db() as conn:
        # 创建访问计数表
        conn.execute("""
            CREATE TABLE IF NOT EXISTS visit_stats (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                total_count INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 创建访问者表（用于去重）
        conn.execute("""
            CREATE TABLE IF NOT EXISTS visitors (
                user_id TEXT PRIMARY KEY,
                first_visit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_visit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 初始化计数记录（如果不存在）
        conn.execute("""
            INSERT OR IGNORE INTO visit_stats (id, total_count) VALUES (1, 10012)
        """)
        
        logger.info("Database initialized successfully")


# 启动时初始化数据库
init_db()


class VisitCountResponse(BaseModel):
    count: int


@app.get("/")
def read_root():
    return {"message": "Visit Counter API (SQLite Version)"}


@app.get("/api/visit-count", response_model=VisitCountResponse)
def get_visitor_count():
    """获取当前访问人数"""
    try:
        with get_db() as conn:
            result = conn.execute(
                "SELECT total_count FROM visit_stats WHERE id = 1"
            ).fetchone()
            
            count = result["total_count"] if result else 0
            return VisitCountResponse(count=count)
    except sqlite3.Error as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"数据库操作失败: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"服务器错误: {str(e)}")


@app.post("/api/visit-count/increment", response_model=VisitCountResponse)
def increment_visitor_count(user_id: Optional[str] = None):
    """增加访问人数并返回新的计数（基于用户ID去重）"""
    try:
        with get_db() as conn:
            # 如果没有提供用户ID，直接增加计数（兼容旧版本）
            if not user_id:
                conn.execute(
                    """UPDATE visit_stats 
                       SET total_count = total_count + 1, 
                           updated_at = CURRENT_TIMESTAMP 
                       WHERE id = 1"""
                )
                result = conn.execute(
                    "SELECT total_count FROM visit_stats WHERE id = 1"
                ).fetchone()
                count = result["total_count"] if result else 0
                logger.info(f"Visitor count incremented. Total: {count}")
                return VisitCountResponse(count=count)
            
            # 检查用户是否已经访问过
            existing = conn.execute(
                "SELECT 1 FROM visitors WHERE user_id = ?",
                (user_id,)
            ).fetchone()
            
            if existing:
                # 用户已经访问过，只更新最后访问时间并返回当前计数
                conn.execute(
                    """UPDATE visitors 
                       SET last_visit_at = CURRENT_TIMESTAMP 
                       WHERE user_id = ?""",
                    (user_id,)
                )
                result = conn.execute(
                    "SELECT total_count FROM visit_stats WHERE id = 1"
                ).fetchone()
                count = result["total_count"] if result else 0
                return VisitCountResponse(count=count)
            
            # 新用户，添加到访问表并增加计数
            conn.execute(
                "INSERT INTO visitors (user_id) VALUES (?)",
                (user_id,)
            )
            conn.execute(
                """UPDATE visit_stats 
                   SET total_count = total_count + 1, 
                       updated_at = CURRENT_TIMESTAMP 
                   WHERE id = 1"""
            )
            
            result = conn.execute(
                "SELECT total_count FROM visit_stats WHERE id = 1"
            ).fetchone()
            count = result["total_count"] if result else 0
            logger.info(f"New visitor {user_id} added. Total visitors: {count}")
            return VisitCountResponse(count=count)
            
    except sqlite3.Error as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"数据库操作失败: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"服务器错误: {str(e)}")


@app.get("/api/visit-count/increment", response_model=VisitCountResponse)
def increment_visitor_count_get(user_id: Optional[str] = None):
    """GET方法增加访问人数（方便前端调用）"""
    return increment_visitor_count(user_id)


@app.get("/api/visit-stats")
def get_visit_stats():
    """获取访问统计信息（管理用）"""
    try:
        with get_db() as conn:
            # 获取总访问人数
            result = conn.execute(
                "SELECT total_count, updated_at FROM visit_stats WHERE id = 1"
            ).fetchone()
            
            # 获取唯一访问者数量
            unique_visitors = conn.execute(
                "SELECT COUNT(*) as count FROM visitors"
            ).fetchone()["count"]
            
            return {
                "total_count": result["total_count"] if result else 0,
                "unique_visitors": unique_visitors,
                "last_updated": result["updated_at"] if result else None
            }
    except sqlite3.Error as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"数据库操作失败: {str(e)}")


@app.post("/api/visit-count/reset")
def reset_count():
    """重置访问计数（管理用，谨慎使用）"""
    try:
        with get_db() as conn:
            conn.execute("UPDATE visit_stats SET total_count = 0, updated_at = CURRENT_TIMESTAMP WHERE id = 1")
            conn.execute("DELETE FROM visitors")
            logger.info("Visit count reset")
            return {"message": "访问计数已重置"}
    except sqlite3.Error as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"数据库操作失败: {str(e)}")


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
