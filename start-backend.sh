#!/bin/bash
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1
export TRANSFORMERS_CACHE="/tmp/transformers_cache"
export MAX_WORKERS=1

# Force garbage collection
python -c "import gc; gc.collect()"

# Start with minimal resources
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1