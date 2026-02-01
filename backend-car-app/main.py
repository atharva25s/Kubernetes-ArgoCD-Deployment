import uvicorn
from fastapi import FastAPI, HTTPException
import random
import time
import logging
from multiprocessing import Queue
from prometheus_fastapi_instrumentator import Instrumentator
import logging_loki
from fastapi.middleware.cors import CORSMiddleware
from car_data import car_details




# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus Metrics
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

# Loki Logging
log_queue = Queue(-1)  

loki_handler = logging_loki.LokiQueueHandler(
    log_queue,
    url="http://<LOKI_URL>/loki/api/v1/push",  # Change to your Loki URL
    tags={"application": "fastapi-emulator"},
    version="1"
)

# Setup Logger
logger = logging.getLogger("fastapi-emulator")
logger.setLevel(logging.INFO)
logger.addHandler(loki_handler)

# Uvicorn Access Logger
uvicorn_logger = logging.getLogger("uvicorn.access")
uvicorn_logger.addHandler(loki_handler)

# Endpoints

@app.get("/health")
def get_status():
    logger.info("GET /health - Service is running")
    return {"message": "Service is running"}

@app.get("/process")
def process_request():
    delay = random.choice([1, 2, 5, 10])  
    time.sleep(delay)
    logger.info(f"GET /process - Request took {delay} seconds")
    return {"message": "Request processed", "delay": delay}

@app.get("/unstable")
def unstable_api():
    if random.random() < 0.3:  
        logger.error("GET /unstable - Simulated failure")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    logger.info("GET /unstable - Request successful")
    return {"message": "Request succeeded"}

@app.get("/getCarDetailsByName/{car_name}")
def get_car_details(car_name: str):
    car_name = car_name.lower()

    if car_name not in car_details:
        logger.warning(f"GET /getCarDetailsByName/{car_name} - Car not found")
        raise HTTPException(status_code=404, detail="Car not found")

    logger.info(f"GET /getCarDetailsByName/{car_name} - Returning car details")
    return {
        "car_name": car_name,
        "specs": car_details[car_name]["specs"]
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)