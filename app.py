# Simple entry point script that imports and runs your app
import os
import sys
sys.path.insert(0, os.path.abspath("."))

from backend.main import app

# This file will be used by Render's deployment