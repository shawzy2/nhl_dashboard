from numpy import NaN
from sqlalchemy import null
import models

def get_team_analysis(db, teamId, gameId):
    # query db to get line statistics
    result = db.execute(
        f"""
        WITH lineShots AS (
            SELECT  gameId, teamId, homeTeamId, type, xgoals,
                    CASE WHEN teamId = homeTeamId THEN homeFwdIds ELSE awayFwdIds END as lineCf,
                    CASE WHEN teamId = homeTeamId THEN awayFwdIds ELSE homeFwdIds END as lineCa
            FROM (
                SELECT gameId, teamId, type,  (
                        SELECT homeTeamId 
                        FROM schedules
                        WHERE gameId={gameId}
                    ) as homeTeamId, awayFwdIds, awayDefIds, homeFwdIds, homeDefIds, xgoals
                FROM shots
                WHERE gameId={gameId} AND scenario='5on5'
            )
        ),
        corsiFor AS (
            SELECT lineCf, COUNT(*) as cf, SUM(xgoals) as xgf
            FROM lineShots
            WHERE gameId={gameId} AND teamId={teamId}
            GROUP BY lineCf
        ),
        corsiAgainst AS (
            SELECT lineCA, COUNT(*) as ca, SUM(xgoals) as xga
            FROM lineShots
            WHERE gameId={gameId} AND teamId!={teamId}
            GROUP BY lineCa
        ),
        minutesPlayed AS (
            SELECT lineId, ROUND(SUM(duration)/60.0, 1) as mp
            FROM shifts
            WHERE gameId={gameId} AND teamId={teamId} AND scenario='5on5'
            GROUP BY lineId
        )
        
        SELECT * FROM (
            SELECT lineCf AS lineId, minutesPlayed.mp as mp, cf, corsiAgainst.ca as ca, xgf, corsiAgainst.xga as xga
            FROM corsiFor
            LEFT JOIN (
                SELECT lineCa, ca, xga
                FROM corsiAgainst
            ) AS corsiAgainst ON lineCf=corsiAgainst.lineCa
            LEFT JOIN (
                SELECT lineId, mp
                FROM minutesPlayed
            ) AS minutesPlayed ON lineCf=minutesPlayed.lineId
            ORDER BY mp DESC
        ) WHERE mp > 0;
        """
    )

    # now convert lineId to individual players and names
    lines = [row for row in result]
    # return lines
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
    
    final = []
    i = 1
    for line in lines:
        linies = [int(i) for i in line['lineId'].split('_')]

        # # sort players by position
        # linies_sorted = []
        # for linemate in linies:
        #     if len(linies_sorted) == 0 and player_info[linemate]['position'] == 'LW':
        #         linies_sorted.append(linemate)

        #         break
        # linies_sorted = []
        # for linie in linies:
        #     if player_info[linie]['position'] == 'LW':
        #         playerId1 = linie
        #     elif player_info[linie]['position'] == 'C':
        #         playerId2 = linie
        #     elif player_info[linie]['position'] == 'RW':
        #         playerId3 = linie



        cf = 0
        ca = 0
        if line['cf'] is not None: cf = line['cf']
        if line['ca'] is not None: ca = line['ca']

        xgf = 0
        xga = 0
        if line['xgf'] is not None: xgf = round(line['xgf'], 2)
        if line['xga'] is not None: xga = round(line['xga'], 2)
        try:
            final.append({
                'name': f'fwd{i}',
                'id': i,
                'player1': player_info[linies[0]]['abbName'],
                'player2': player_info[linies[1]]['abbName'],
                'player3': player_info[linies[2]]['abbName'],
                'headshot1': f'/assets/headshots/{linies[0]}.jpg',
                'headshot2': f'/assets/headshots/{linies[1]}.jpg',
                'headshot3': f'/assets/headshots/{linies[2]}.jpg',
                'mp': line['mp'],
                'cf': cf,
                'ca': ca,
                'cr': cf - ca,
                'xgf': xgf,
                'xga': xga,
                'xgr': round(xgf - xga, 2)
            })
            i += 1
        except:
            pass
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
            SELECT teamId, primaryColor
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

    # build return body
    # team1 is away, team2 is home
    final = {}
    teamId1 = teams_organized['away']['teamId']
    teamId2 = teams_organized['home']['teamId']
    final['logoTeam1'] = f'/assets/logos/{teamId1}.svg'
    final['logoTeam2'] = f'/assets/logos/{teamId2}.svg'
    final['goalsTeam1'] = teams_organized['away']['goals']
    final['goalsTeam2'] = teams_organized['home']['goals']
    final['colorTeam1'] = teams_organized['away']['primaryColor']
    final['colorTeam2'] = teams_organized['home']['primaryColor']
    
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
            WHERE type='SHOT' AND gameId={gameId}
            GROUP BY teamId, time
        ),
        allTimeFrames AS (
            WITH RECURSIVE
                cnt(x) AS (
                SELECT 0
                UNION ALL
                SELECT x+1 FROM cnt
                    LIMIT 3601
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
        'shotsAvgAway': []
    }
    for row in result:
        if row['time'] % 300 == 0:
            final['labels'].append(str(int(row['time'] / 60)) + ':00')
        else:
            final['labels'].append('')
        final['shotsAvgHome'].append(row['shotsAvgHome'])
        final['shotsAvgAway'].append(row['shotsAvgAway'])

    # get colors for each team
    result = db.execute(
        f"""
        SELECT abbreviation, isHome, primaryColor
        FROM boxscores 
        LEFT JOIN (
            SELECT teamId, abbreviation, primaryColor FROM teams
        ) USING(teamId)
        WHERE gameId={gameId};
        """
    )
    for row in result:
        if row['isHome']:
            final['colorHome'] = row['primaryColor']
            final['abbHome'] = row['abbreviation']
        else:
            final['colorAway'] = row['primaryColor']
            final['abbAway'] = row['abbreviation']

    return final