def get_teams_by_division(db):
    # query db to get schedule for this team
    result = db.execute(
        f"""
        SELECT teamId as id, name, division 
        FROM teams
        ORDER BY division, name;
        """
    )

    # convert to object
    teams = [row for row in result]

    # group by division
    divisions = {}
    for team in teams:
        div = team['division']
        if div not in divisions:
            divisions[div] = []
        divisions[div].append({
            'id': team['id'],
            'name': team['name']
        })

    # convert to angular object and return
    return [{
        'divisionName': div,
        'teams': teams
    } for div, teams in divisions.items()]