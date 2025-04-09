#!/bin/bash
# Memory optimization
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1 
export HF_HOME="/tmp/huggingface"
export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:32
export PYTORCH_NO_CUDA_MEMORY_CACHING=1

# Force using CPU only
python -c "import os; os.environ['CUDA_VISIBLE_DEVICES']=''; import torch; torch.set_num_threads(1)"

# Start app with minimal workers
cd /app && python -m uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1