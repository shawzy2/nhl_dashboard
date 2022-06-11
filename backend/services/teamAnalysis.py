from turtle import color
from numpy import NaN
from sqlalchemy import null
import models
from utils.color import decide_color

def get_team_analysis(db, teamId, gameId):
    # query db to get line statistics
    result = db.execute(
        f"""
        WITH lineShots AS (
            SELECT  gameId, teamId, homeTeamId, type, xgoals, scenario,
                    CASE WHEN teamId = homeTeamId THEN homeFwdIds ELSE awayFwdIds END as fwdCfLine,
                    CASE WHEN teamId = homeTeamId THEN awayFwdIds ELSE homeFwdIds END as fwdCaLine,
                    CASE WHEN teamId = homeTeamId THEN homeDefIds ELSE awayDefIds END as defCfLine,
                    CASE WHEN teamId = homeTeamId THEN awayDefIds ELSE homeDefIds END as defCaLine,
                    CASE WHEN teamId = homeTeamId THEN homeFwdIds || '_' || homeDefIds ELSE awayFwdIds || '_' || awayDefIds END as allCfLine,
                    CASE WHEN teamId = homeTeamId THEN awayFwdIds || '_' || awayDefIds ELSE homeFwdIds || '_' || homeDefIds END as allCaLine,
                    CASE WHEN teamId = homeTeamId THEN homeNumPlayers ELSE awayNumPlayers END as numPlayers
            FROM (
                SELECT gameId, teamId, type, (
                    SELECT homeTeamId FROM schedules
                    WHERE gameId={gameId}
                ) as homeTeamId, awayFwdIds, awayDefIds, homeFwdIds, homeDefIds, 
                       xgoals, scenario, homeNumPlayers, awayNumPlayers
                FROM shots
                WHERE gameId={gameId} AND scenario='5on5'
            )
        ),
        fwdCorsiFor AS (
            SELECT fwdCfLine as lineId, COUNT(*) as cf, SUM(xgoals) as xgf
            FROM lineShots
            WHERE teamId={teamId}
            GROUP BY lineId
        ),
        defCorsiFor AS (
            SELECT defCfLine as lineId, COUNT(*) as cf, SUM(xgoals) as xgf
            FROM lineShots
            WHERE teamId={teamId}
            GROUP BY lineId
        ),
        fwdCorsiAgainst AS (
            SELECT fwdCaLine as lineId, COUNT(*) as ca, SUM(xgoals) as xga
            FROM lineShots
            WHERE teamId!={teamId}
            GROUP BY lineId
        ),
        defCorsiAgainst AS (
            SELECT defCaLine as lineId, COUNT(*) as ca, SUM(xgoals) as xga
            FROM lineShots
            WHERE teamId!={teamId} 
            GROUP BY lineId
        ),
        allCorsiFor AS (
            SELECT allCfLine as lineId, COUNT(*) as cf, SUM(xgoals) as xgf
            FROM lineShots
            WHERE teamId={teamId}
            GROUP BY lineId
        ),
        allCorsiAgainst AS (
            SELECT allCaLine as lineId, COUNT(*) as ca, SUM(xgoals) as xga
            FROM lineShots
            WHERE teamId!={teamId}
            GROUP BY lineId
        ),
        minutesPlayed AS (
            SELECT lineId, lineType, ROUND(SUM(duration)/60.0, 1) as mp
            FROM shifts
            WHERE gameId={gameId} AND teamId={teamId} AND scenario='5on5'
            GROUP BY lineId
        ),
        fwdStats AS (
            SELECT lineId, lineType, mp, IFNULL(cf,0) as cf, 
                    IFNULL(ca,0) as ca,
                    IFNULL(ROUND(xgf,2),0) as xgf,
                    IFNULL(ROUND(xga,2),0) as xga
            FROM minutesPlayed
            LEFT JOIN fwdCorsiFor USING(lineId)
            LEFT JOIN fwdCorsiAgainst USING(lineId)
            WHERE lineType='fwd' AND mp>0.1
        ),
        defStats AS (
            SELECT lineId, lineType, mp, IFNULL(cf,0) as cf, 
                    IFNULL(ca,0) as ca,
                    IFNULL(ROUND(xgf,2),0) as xgf,
                    IFNULL(ROUND(xga,2),0) as xga
            FROM minutesPlayed
            LEFT JOIN defCorsiFor USING(lineId)
            LEFT JOIN defCorsiAgainst USING(lineId)
            WHERE lineType='def' AND mp>0.1
        ),
        allStats AS (
            SELECT lineId, lineType, mp, IFNULL(cf,0) as cf, 
                    IFNULL(ca,0) as ca,
                    IFNULL(ROUND(xgf,2),0) as xgf,
                    IFNULL(ROUND(xga,2),0) as xga
            FROM minutesPlayed
            LEFT JOIN allCorsiFor USING(lineId)
            LEFT JOIN allCorsiAgainst USING(lineId)
            WHERE lineType='skater' AND mp>0.1
        )
        SELECT * FROM fwdStats UNION
        SELECT * FROM defStats UNION
        SELECT * FROM allStats
        ORDER BY lineType DESC, mp DESC;
        """
    )

    # now convert lineId to individual players and names
    lines = [row for row in result]

    all_playerIds = set()
    for line in lines:
        for playerId in line['lineId'].split('_'):
            all_playerIds.add(playerId)

    players =  db.query(
        models.Roster.playerId, 
        models.Roster.firstName, 
        models.Roster.lastName,
        models.Roster.position
    ).filter(models.Roster.playerId.in_(all_playerIds)).all()

    player_info = {}
    for player in players:
        player_info[player['playerId']] = {
            'abbName': player['firstName'][:1] + '. ' + player['lastName'],
            'position': player['position']
        }
    
    # return player_info
    
    final = {'fwd': [], 'def': [], 'skater': []}
    i = 1
    for line in lines:
        linies = [int(i) for i in line['lineId'].split('_')]
        players_in_line = [{
            'name': player_info[linie_id]['abbName'],
            'playerId': linie_id
        } for linie_id in linies]

        line_type = line['lineType']
        final[line_type].append({
            'id': len(final[line_type]) + 1,
            'mp': line['mp'],
            'cf': line['cf'],
            'ca': line['ca'],
            'cr': line['cf'] - line['ca'],
            'xgf': line['xgf'],
            'xga': line['xga'],
            'xgr': round(line['xgf'] - line['xga'], 2),
            'players': players_in_line
        })
    return final

def get_team_analysis_summary(db, gameId):
    result = db.execute(
        f"""
        WITH game AS (
            SELECT teamId, isHome, goals, pim, 
                powerPlayGoals || '/' || powerPlayOpportunities as ppStr
            FROM boxscores
            WHERE gameId={gameId}
        ),
        allTeams AS (
            SELECT teamId, primaryColor, secondaryColor
            FROM teams
        ),
        shotStats AS (
            SELECT teamId, 
                SUM(CASE type WHEN 'SHOT' THEN 1 
                        WHEN 'GOAL' THEN 1
                        ELSE 0 END) as sog,
                COUNT(*) AS cf, 
                ROUND(SUM(xgoals),2) as xgf
            FROM shots
            WHERE gameId={gameId}
            GROUP BY teamId
        ),
        faceoffStats AS (
            SELECT teamWinId as teamId, COUNT(*) AS faceoffWins
            FROM faceoffs
            WHERE gameId={gameId}
            GROUP BY teamWinId
        )
        SELECT *
        FROM game
        LEFT JOIN allTeams USING(teamId)
        LEFT JOIN shotStats USING(teamId)
        LEFT JOIN faceoffStats USING(teamId);
        """)

    # read data from query
    teams = [row for row in result]
    # return teams

    teams_organized = {}
    for team in teams:
        if team['isHome'] == 1:
            teams_organized['home'] = team
        else:
            teams_organized['away'] = team
    
    # get colors for each team
    final_colors = decide_color(
        teams_organized['home']['primaryColor'], 
        teams_organized['home']['secondaryColor'], 
        teams_organized['away']['primaryColor'], 
        teams_organized['away']['secondaryColor']
    )


    # build return body
    # team1 is away, team2 is home
    final = {}
    teamId1 = teams_organized['away']['teamId']
    teamId2 = teams_organized['home']['teamId']
    final['logoTeam1'] = f'/assets/logos/{teamId1}.svg'
    final['logoTeam2'] = f'/assets/logos/{teamId2}.svg'
    final['goalsTeam1'] = teams_organized['away']['goals']
    final['goalsTeam2'] = teams_organized['home']['goals']
    final['colorTeam1'] = final_colors['away']
    final['colorTeam2'] = final_colors['home']
    
    stats = {
        'xgf': 'Expected Goals',
        'sog': 'Shots on Goal',
        'cf': 'Corsi',
        'faceoffWins': 'Faceoff Wins',
        'ppStr': 'PowerPlays',
        'pim': 'PIM'
    }
    final['stats'] = [{
        'statName': name,
        'statValueTeam1': teams_organized['away'][stat_key],
        'statValueTeam2': teams_organized['home'][stat_key]
    } for stat_key, name in stats.items()]

    return final

def get_team_analysis_gameflow(db, gameId):
    result = db.execute(
        f"""
        WITH game AS (
            SELECT teamId, isHome
            FROM boxscores
            WHERE gameId={gameId}
        ),
        gameShots AS (
            SELECT teamId, 
                time, 
                SUM(1) as numShots
            FROM shots
            WHERE (type='SHOT' OR type='GOAL') AND gameId={gameId}
            GROUP BY teamId, time
        ),
        allTimeFrames AS (
            WITH RECURSIVE
                cnt(x) AS (
                SELECT 0
                UNION ALL
                SELECT x+1 FROM cnt
                    LIMIT (SELECT max(time) FROM gameShots) + 60
                )
            SELECT x as time
            FROM cnt
        ),
        homeShots AS (
            SELECT time, numShots
            FROM gameShots
            WHERE teamId IN (SELECT teamId FROM game WHERE isHome=1)
        ),
        homeShotsAvg AS (
            SELECT time, 
            ROUND(AVG(IFNULL(numShots,0)) OVER(ORDER BY time
                    ROWS BETWEEN 300 PRECEDING AND CURRENT ROW )*3600,1) as shotsAvgHome
            FROM allTimeFrames
            LEFT JOIN homeShots USING(time)
        ),
        awayShots AS (
            SELECT time, numShots
            FROM gameShots
            WHERE teamId IN (SELECT teamId FROM game WHERE isHome=0)
        ),
        awayShotsAvg AS (
            SELECT time, 
            ROUND(AVG(IFNULL(numShots,0)) OVER(ORDER BY time
                    ROWS BETWEEN 300 PRECEDING AND CURRENT ROW )*3600,1) as shotsAvgAway
            FROM allTimeFrames
            LEFT JOIN awayShots USING(time)
        )
        SELECT time, shotsAvgHome, shotsAvgAway
        FROM homeShotsAvg
        LEFT JOIN awayShotsAvg USING(time)
        WHERE time%60=0;
        """
    )

    final = {
        'labels': [],
        'shotsAvgHome': [],
        'shotsAvgAway': [],
        'goalTimesHome': [],
        'goalTimesAway': []
    }
    for row in result:
        if row['time'] % 300 == 0:
            final['labels'].append(str(int(row['time'] / 60)) + ':00')
        else:
            final['labels'].append('')
        final['shotsAvgHome'].append(row['shotsAvgHome'])
        final['shotsAvgAway'].append(row['shotsAvgAway'])

    # get colors and abbreviation for each team
    result = db.execute(
        f"""
        SELECT abbreviation, isHome, primaryColor, secondaryColor
        FROM boxscores 
        LEFT JOIN (
            SELECT teamId, abbreviation, primaryColor, secondaryColor FROM teams
        ) USING(teamId)
        WHERE gameId={gameId};
        """
    )
    available_colors = {}
    for row in result:
        if row['isHome']:
            available_colors['homePrimary'] = row['primaryColor']
            available_colors['homeSecondary'] = row['secondaryColor']
            final['abbHome'] = row['abbreviation']
        else:
            available_colors['awayPrimary'] = row['primaryColor']
            available_colors['awaySecondary'] = row['secondaryColor']
            final['abbAway'] = row['abbreviation']
    final_colors = decide_color(available_colors['homePrimary'], available_colors['homeSecondary'], available_colors['awayPrimary'], available_colors['awaySecondary'])
    final['colorHome'] = final_colors['home']
    final['colorAway'] = final_colors['away']

    # get goal times for each team
    result = db.execute(
        f"""
        WITH game AS (
            SELECT teamId, isHome
            FROM boxscores
            WHERE gameId={gameId}
        ),
        gameShots AS (
            SELECT teamId, 
                type,
                time, 
                SUM(1) as numShots
            FROM shots
            WHERE (type='SHOT' OR type='GOAL') AND gameId={gameId}
            GROUP BY teamId, time
        )
        SELECT time, isHome
        FROM gameShots
        LEFT JOIN game USING(teamId)
        WHERE type='GOAL';
        """
    )
    for row in result:
        if row['isHome']:
            final['goalTimesHome'].append(row['time'])
        else:
            final['goalTimesAway'].append(row['time'])

    return final