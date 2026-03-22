from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import csv
import os
from datetime import datetime

app = FastAPI(title="ClearOps MVP Backend")

# Enable CORS so the static HTML page can talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CONTRACTORS_DB = "contractors.csv"
TALENT_DB = "talent.csv"

# Initialize CSV files if they don't exist
def init_db(filename, headers):
    if not os.path.exists(filename):
        with open(filename, mode='w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(headers)

init_db(CONTRACTORS_DB, ["timestamp", "email", "status"])
init_db(TALENT_DB, ["timestamp", "email", "clearance_level", "status"])

@app.post("/api/contractor")
async def register_contractor(email: str = Form(...)):
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email")
        
    with open(CONTRACTORS_DB, mode='a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([datetime.now().isoformat(), email, "pending_review"])
        
    return {"message": "Contractor lead captured successfully."}

@app.post("/api/talent")
async def register_talent(email: str = Form(...), clearance: str = Form(...)):
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email")
        
    with open(TALENT_DB, mode='a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([datetime.now().isoformat(), email, clearance, "pending_verification"])
        
    return {"message": "Talent lead captured successfully. Awaiting DISS."}

from fastapi.responses import FileResponse

@app.get("/pitch")
async def pitch_deck():
    return FileResponse("pitch.html")

# Serve the static website natively 
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
