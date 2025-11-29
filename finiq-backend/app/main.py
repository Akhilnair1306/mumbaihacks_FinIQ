from fastapi import FastAPI
from app.routers import health,users,transactions,agent_daily

app = FastAPI(title= "FINIQ Backend")

app.include_router(health.router)
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(agent_daily.router)

@app.get("/")
def home():
    return {"message": "Loaded successfully"}