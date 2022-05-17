from sqlalchemy import null
import models

def get_team_analysis(db, teamId, gameId):
    # query db to get line statistics
    result = db.execute(
        f"""
        WITH lineShots AS (
            SELECT  gameId, teamId, homeTeamId, type,
                    CASE WHEN teamId = homeTeamId THEN homeFwdIds ELSE awayFwdIds END as lineCf,
                    CASE WHEN teamId = homeTeamId THEN awayFwdIds ELSE homeFwdIds END as lineCa
            FROM (
                SELECT gameId, teamId, type, (
                        SELECT homeTeamId FROM schedules
                        WHERE gameId={gameId}
                    ) as homeTeamId, awayFwdIds, awayDefIds, homeFwdIds, homeDefIds
                FROM shots
                WHERE gameId={gameId} AND scenario='5on5'
            )
        ),
        corsiFor AS (
            SELECT lineCf, COUNT(*) as cf
            FROM lineShots
            WHERE gameId={gameId} AND teamId={teamId}
            GROUP BY lineCf
        ),
        corsiAgainst AS (
            SELECT lineCA, COUNT(*) as ca
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
            SELECT lineCf AS lineId, minutesPlayed.mp as mp, cf, corsiAgainst.ca as ca
            FROM corsiFor
            LEFT JOIN (
                SELECT lineCa, ca
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
        try:
            final.append({
                'name': f'fwd{i}',
                'id': i,
                'player1': player_info[linies[0]]['abbName'],
                'player2': player_info[linies[1]]['abbName'],
                'player3': player_info[linies[2]]['abbName'],
                'headshot1': f'/assets/teams/{teamId}/headshots/{linies[0]}.jpg',
                'headshot2': f'/assets/teams/{teamId}/headshots/{linies[1]}.jpg',
                'headshot3': f'/assets/teams/{teamId}/headshots/{linies[2]}.jpg',
                'mp': line['mp'],
                'cf': cf,
                'ca': ca,
                'cr': cf - ca,
                'xgf': 0,
                'xga': 0,
                'xgr': 0
            })
            i += 1
        except:
            pass
    return final
    
    # return lines
    # return db.query(models.Roster).filter(models.Roster.playerId == playerId).all()

    # return [row for row in players]

# GET_TEAM_ANAYSIS_QUERY = f"""SELECT * FROM schedules;"""