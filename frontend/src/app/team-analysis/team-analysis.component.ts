import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { NONE_TYPE } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { LineStatsItem } from '../line-stats/line-stats-datasource';

interface Game {
  gameId: number,
  date: string,
  opponent: string
}

interface Team {
  id: number,
  name: string
}

interface Division {
  divisionName: string,
  teams: Team[]
}

@Component({
  selector: 'app-team-analysis',
  templateUrl: './team-analysis.component.html',
  styleUrls: ['./team-analysis.component.scss']
})
export class TeamAnalysisComponent {
  @Input() selectedTeam = { name: 'NHL',   id: '0' }
  @Input() selectedGameId = 0

  directionsMessage: String = 'Please Select Team';
  teams: Team[] = [];
  divisions: Division[] = []
  games: Game[] = [];
  lineStats: LineStatsItem[] = []; 
  gameSummary: any = {}
  gameflow: any = {}

  ngOnInit() {
    // update 'Select a Team' selector
    var url = `http://localhost:8000/teams/division`
    this.http.get<any>(url).subscribe(
      response => {
        this.divisions = response as Division[];
      }
    )
  }

  changeSelectedTeam(selectedTeam: any) {
    console.log(selectedTeam.id);
    // reset selector vals
    this.directionsMessage = 'Please Select Game'
    this.selectedGameId = 0;
    this.lineStats = [];
    this.gameSummary = {};
    this.gameflow = {};

    // update 'Select a Game' selector
    var url = `http://localhost:8000/schedule/${this.selectedTeam.id}`
    this.http.get<any>(url).subscribe(
      response => {
        this.games = response as Game[];
      }
    )
  }

  changeSelectedGameId(selectedGameId: any) {
    // update lineStats data
    var url = `http://localhost:8000/team-analysis/${this.selectedTeam.id}/${this.selectedGameId}`
    this.http.get<any>(url).subscribe(
      response => {
        this.lineStats = response as LineStatsItem[];
      }
    )

    // update gameSummary data
    var url = `http://localhost:8000/team-analysis/${this.selectedTeam.id}/${this.selectedGameId}/summary`
    this.http.get<any>(url).subscribe(
      response => {
        this.gameSummary = response;
      }
    )

    //set gameflow data
    var url = `http://localhost:8000/team-analysis/3/${this.selectedGameId}/gameflow`
    this.http.get<any>(url).subscribe(
      response => {
        console.log(response)
        this.gameflow = response;
      }
    )
  }
  

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient) {
  }
}
