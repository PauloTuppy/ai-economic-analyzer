# backend/services/cache_service.py

import json
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self, redis_client: Optional[Any]):
        self.redis_client = redis_client

    def get(self, key: str) -> Optional[Any]:
        if not self.redis_client:
            return None
        try:
            cached_data = self.redis_client.get(key)
            if cached_data:
                return json.loads(cached_data)
        except Exception as e:
            logger.error(f"Error getting from cache: {e}")
        return None

    def set(self, key: str, value: Any, ttl: int) -> None:
        if not self.redis_client:
            return
        try:
            self.redis_client.setex(key, ttl, json.dumps(value))
        except Exception as e:
            logger.error(f"Error setting cache: {e}")
