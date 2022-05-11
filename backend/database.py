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

df = pd.read_json('data/shotSample.json', dtype={
    'awayFwdIds': 'str',
    'awayDefIds': 'str',
    'awayGoalieIds': 'str',
    'homeFwdIds': 'str',
    'homeDefIds': 'str',
    'homeGoalieIds': 'str',
})
df.to_sql(name='shots', con=engine, if_exists='replace', index=False)

# with open('data/shotSample.json') as f:
#     shots = json.load(f)

# for i in range(0, len(shots)):
#     SessionLocal.add(models.Shot(**{
#         'shotId': i,
#         'gameId': shots[i]['gameId'],
#         'shooterId': shots[i]['shooterId']
#     }))

