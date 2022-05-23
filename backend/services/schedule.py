from sqlalchemy import null
import models


def get_team_schedule(db, teamId):
    # query db to get schedule for this team
    result = db.execute(
        f"""
        WITH games as (
            SELECT gameId, awayTeamId, homeTeamId, dateTime
            FROM schedules
            WHERE awayTeamId={teamId} OR homeTeamId={teamId}
            ORDER BY gameId
        ),
        teamInfo as (
            SELECT teamId, teamName
            FROM teams
        )
        SELECT gameId as id, 
            t1.teamName AS awayTeam, 
            t2.teamName as homeTeam,
            strftime('%m-%d', dateTime) as date
        FROM games
        LEFT JOIN teamInfo t1 ON awayTeamId=t1.teamId
        LEFT JOIN teamInfo t2 ON homeTeamId=t2.teamId;
        """
    )

    # convert to object
    games = [row for row in result]
    
    return games