from sqlalchemy import null, text
import models


def get_team_schedule(db, teamId):
    # query db to get schedule for this team
    result = db.execute(text(
        f"""
        WITH games as (
            SELECT gameId, awayTeamId, homeTeamId, date(dateTime,'-4 hours') as dateTime
            FROM schedules
            WHERE awayTeamId={teamId} OR homeTeamId={teamId}
            ORDER BY gameId
        ),
        teamInfo as (
            SELECT teamId, name
            FROM teams
        )
        SELECT gameId, 
            awayTeamId,
            t1.name AS awayTeam, 
            t2.name as homeTeam,
            strftime('%m-%d', dateTime) as date
        FROM games
        LEFT JOIN teamInfo t1 ON awayTeamId=t1.teamId
        LEFT JOIN teamInfo t2 ON homeTeamId=t2.teamId;
        """
    ))

    # convert to object
    games = result.mappings().all()
    
    final = []
    for game in games:
        # first assume the team is playing a home game
        opp_team = game['awayTeam']
        prefix = 'vs '
        
        # check if team is actually playing an away game
        if game['awayTeamId'] == teamId:
            opp_team = game['homeTeam']
            prefix = '@ '
        
        # build string that will appear in dropdown menu
        final.append({
            'gameId': game['gameId'],
            'date': game['date'],
            'opponent': prefix + opp_team
        })
    
    return final