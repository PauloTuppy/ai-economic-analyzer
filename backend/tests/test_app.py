# backend/tests/test_app.py

import pytest
from app import create_app

def test_app_creation():
    """
    Tests if the Flask application can be created without errors.
    """
    app = create_app()
    assert app is not None
