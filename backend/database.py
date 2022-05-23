from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json
import models
import pandas as pd

SQLALCHEMY_DATABASE_URL = "sqlite:///./db.sqlite"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# import shot data
df = pd.read_json('data/shotSample.json', dtype={
    'awayFwdIds': 'str',
    'awayDefIds': 'str',
    'awayGoalieIds': 'str',
    'homeFwdIds': 'str',
    'homeDefIds': 'str',
    'homeGoalieIds': 'str',
})
df.to_sql(name='shots', con=engine, if_exists='replace', index=False)

# import shift data
df = pd.read_json('data/shiftSample.json', dtype={
    'lineId': 'str'
})
df.to_sql(name='shifts', con=engine, if_exists='replace', index=False)

# import roster data
df = pd.read_json('data/rosterSample.json')
df.to_sql(name='rosters', con=engine, if_exists='replace', index=False)

# import schedule data
df = pd.read_json('data/scheduleSample.json')
df.to_sql(name='schedules', con=engine, if_exists='replace', index=False)

# import team data
df = pd.read_json('data/teamsCurrent.json')
df.to_sql(name='teams', con=engine, if_exists='replace', index=False)

