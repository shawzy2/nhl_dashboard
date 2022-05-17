from sqlite3 import Date
from xmlrpc.client import DateTime
from numpy import integer
from sqlalchemy import Boolean, Column, Float, Integer, String

from database import Base


class Shot(Base):
    __tablename__ = "shots"
    
    shotId = Column(Integer, primary_key=True, index=True)
    gameId = Column(Integer)
    shooterId = Column(Integer)
    goalieId = Column(Integer)
    blockerId = Column(Integer)
    teamId = Column(Integer)
    x = Column(Float)
    y = Column(Float)
    time = Column(Integer)
    type = Column(String(20))
    awayNumPlayers = Column(Integer)
    awayFwdIds = Column(String(30))
    awayDefIds = Column(String(20))
    awayGoalieIds = Column(String(10))
    homeNumPlayers = Column(Integer)
    homeFwdIds = Column(String(30))
    homeDefIds = Column(String(20))
    homeGoalieIds = Column(String(10))
    scenario = Column(String(10))

'''TODO look into multi column keys'''
class Shift(Base):
    __tablename__ = "shifts"

    shiftId = Column(Integer, primary_key=True, index=True)
    gameId = Column(Integer)
    teamId = Column(Integer)
    lineId = Column(String(20))
    lineType = Column(String(10))
    scenario = Column(String(10))
    start = Column(Integer)
    end = Column(Integer)
    duration = Column(Integer)

class Roster(Base):
    __tablename__ = "rosters"

    playerId = Column(Integer, primary_key=True, index=True)
    firstName = Column(String(20))
    lastName = Column(String(20))
    primaryNumber = Column(Integer)
    birthCity = Column(String(20))
    birthCountry = Column(String(20))
    nationality = Column(String(10))
    height = Column(Integer)
    weight = Column(Integer)
    shootsCatches = Column(String(1))
    teamId = Column(Integer)
    position = Column(String(5))

'''TODO fix dateTime column'''
class Schedule(Base):
    __tablename__ = "schedules"

    gameId = Column(Integer, primary_key=True, index=True)
    # dateTime = Column(DateTime)
    awayTeamId = Column(Integer)
    homeTeamId = Column(Integer)

class Team(Base):
    __tablename__ = "teams"

    teamId = Column(Integer, primary_key=True, index=True)
    name = Column(String(30))
    locationName = Column(String(20))
    teamName = Column(String(20))
    abbreviation = Column(String(5))
    division = Column(String(20))
    conference = Column(String(20))
    firstYearOfPlay = Column(Integer)
    venue = Column(String(30))
    timezone = Column(String(5))

# schemas?