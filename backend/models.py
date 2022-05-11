from sqlalchemy import Boolean, Column, Float, Integer, String

from database import Base


class Shot(Base):
    __tablename__ = "shots"

    # id = Column(Integer, primary_key=True, index=True)
    # title = Column(String)
    # complete = Column(Boolean, default=False)
    
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



# schemas?