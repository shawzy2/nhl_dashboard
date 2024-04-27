from sqlalchemy import text

def get_teams_by_division(db):
    # query db to get schedule for this team
    result = db.execute(text(
        f"""
        WITH t AS (
            SELECT teamId, name, division 
            FROM teams
        ),
        u AS (
            SELECT DISTINCT(teamId) AS teamId
            FROM boxscores
        )
        SELECT * 
        FROM u
        LEFT JOIN t USING(teamId)
        ORDER BY division, name;
        """
    ))

    # convert to object
    teams = result.mappings().all()

    # group by division
    divisions = {}
    for team in teams:
        div = team['division']
        if div not in divisions:
            divisions[div] = []
        divisions[div].append({
            'id': team['teamId'],
            'name': team['name']
        })

    # convert to angular object and return
    return [{
        'divisionName': div,
        'teams': teams
    } for div, teams in divisions.items()]