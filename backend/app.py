from fastapi import FastAPI, Depends, Request, Form, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from starlette.responses import JSONResponse, RedirectResponse
from starlette.templating import Jinja2Templates

from sqlalchemy.orm import Session
from sqlalchemy import or_

import models
from  services import teamAnalysis, schedule, team
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

templates = Jinja2Templates(directory="templates")

app = FastAPI()

origins = [
    "http://localhost:4200",
    "http://localhost",
    "http://frontend:4200",
    "http://frontend",
    "http://0.0.0.0:4200",
    "http://0.0.0.0"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home(request: Request, db: Session = Depends(get_db)):
    shots = db.query(models.Shot).all()
    return shots

'''TODO look into query string params'''
@app.get("/rosters/team/{teamId}")
def get_roster(request: Request, teamId: int, db: Session = Depends(get_db)):
    # q1 = Request.query_params.get('q1')
    return db.query(models.Roster).filter(models.Roster.teamId == teamId).all()

@app.get("/teams/division")
def get_teams(request: Request, db: Session = Depends(get_db)):
    return team.get_teams_by_division(db)


@app.get("/rosters/player/{playerId}")
def get_player(request: Request, playerId: int, db: Session = Depends(get_db)):
    return db.query(models.Roster).filter(models.Roster.playerId == playerId).all()

@app.get("/schedule/{teamId}")
def get_schedule(request: Request, teamId: int, db: Session = Depends(get_db)):
    return schedule.get_team_schedule(db, teamId)

@app.get("/team-analysis/{gameId}/summary")
def get_team_analysis_summary(request: Request, gameId: int, db: Session = Depends(get_db)):
    return teamAnalysis.get_team_analysis_summary(db, gameId)

@app.get("/team-analysis/{gameId}/gameflow")
def get_team_analysis_gameflow(request: Request, gameId: int, db: Session = Depends(get_db)):
    return teamAnalysis.get_team_analysis_gameflow(db, gameId)

@app.get("/team-analysis/{gameId}/linestats/{teamId}")
def get_team_analysis(request: Request, teamId: int, gameId: int, db: Session = Depends(get_db)):
    return teamAnalysis.get_team_analysis(db, teamId, gameId)



# @app.get("/teamAnalysis/corsi/{gameId}/{teamId}")
# def get_corsi(request: Request, gameId: int, teamId: int, db: Session = Depends(get_db)):
#     return ''


# @app.post("/add")
# def add(request: Request, title: str = Form(...), db: Session = Depends(get_db)):
#     new_todo = models.Todo(title=title)
#     db.add(new_todo)
#     db.commit()

#     url = app.url_path_for("home")
#     return RedirectResponse(url=url, status_code=status.HTTP_303_SEE_OTHER)


# @app.get("/update/{todo_id}")
# def update(request: Request, todo_id: int, db: Session = Depends(get_db)):
#     todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
#     todo.complete = not todo.complete
#     db.commit()

#     url = app.url_path_for("home")
#     return RedirectResponse(url=url, status_code=status.HTTP_302_FOUND)


# @app.get("/delete/{todo_id}")
# def delete(request: Request, todo_id: int, db: Session = Depends(get_db)):
#     todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
#     db.delete(todo)
#     db.commit()

#     url = app.url_path_for("home")
#     return RedirectResponse(url=url, status_code=status.HTTP_302_FOUND)