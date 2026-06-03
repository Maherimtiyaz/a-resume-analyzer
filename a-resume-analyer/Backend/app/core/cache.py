import json
import os
import redis.asyncio as redis
from typing import Optional, Any
import logging

logger = logging.getLogger(__name__)

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Global Redis client
redis_client: Optional[redis.Redis] = None

async def init_redis():
    """Initialize Redis connection"""
    global redis_client
    try:
        redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        # Ping to test connection
        await redis_client.ping()
        logger.info(f"✅ Connected to Redis at {REDIS_URL}")
    except Exception as e:
        logger.error(f"❌ Failed to connect to Redis: {e}")
        redis_client = None

async def close_redis():
    """Close Redis connection"""
    global redis_client
    if redis_client:
        await redis_client.close()
        logger.info("Redis connection closed.")

async def get_cache(key: str) -> Optional[Any]:
    """Get value from cache"""
    if not redis_client:
        return None
    try:
        val = await redis_client.get(key)
        if val:
            return json.loads(val)
        return None
    except Exception as e:
        logger.warning(f"Cache get error for {key}: {e}")
        return None

async def set_cache(key: str, value: Any, expire_secs: int = 3600) -> bool:
    """Set value in cache"""
    if not redis_client:
        return False
    try:
        await redis_client.set(key, json.dumps(value), ex=expire_secs)
        return True
    except Exception as e:
        logger.warning(f"Cache set error for {key}: {e}")
        return False
