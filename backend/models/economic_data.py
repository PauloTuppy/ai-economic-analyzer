# backend/models/economic_data.py

from typing import Any, Dict

class EconomicDataManager:
    def get_indicators(self) -> Dict[str, Any]:
        # This is a mock implementation
        return {
            "brazil": {
                "selic_rate": 11.75,
                "ipca_12m": 4.2,
                "gdp_growth": 2.8,
            },
            "usa": {
                "fed_rate": 5.25,
                "cpi_12m": 3.1,
                "gdp_growth": 2.1,
            },
            "global": {
                "world_gdp_growth": 3.0,
                "global_inflation": 2.9,
            },
            "status": "ok",
        }
