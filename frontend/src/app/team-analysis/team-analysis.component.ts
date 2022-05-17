import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { NONE_TYPE } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { LineStatsItem } from '../line-stats/line-stats-datasource';

@Component({
  selector: 'app-team-analysis',
  templateUrl: './team-analysis.component.html',
  styleUrls: ['./team-analysis.component.scss']
})
export class TeamAnalysisComponent {
  @Input() selectedTeam = { name: 'NHL',   id: '0' }
  @Input() selectedGameId = 0

  teams = [
    { name: 'Anaheim Ducks',   id: '24' },
    { name: 'Arizona Coyotes', id: '53' },
    { name: 'Boston Bruins',   id: '6' },
    { name: 'Pittsburgh Penguins',   id: '5' },
    { name: 'New York Rangers',   id: '3' }
  ]
  gameIds = [2021020001, 2021020002, 2021030143];

  lineStats: LineStatsItem[] = []; 

  ngOnInit() {
    var url = `http://localhost:8000/team-analysis/${this.selectedTeam.id}/${this.selectedGameId}`
    this.http.get<any>(url).subscribe(
      response => {
        console.log(response);
        this.lineStats = response as LineStatsItem[];
        console.log(this.lineStats);
      }
    )
  }

  changeSelectedTeam(selectedTeam: any) {
    console.log(selectedTeam.id);
  }

  changeSelectedGameId(selectedGameId: any) {
    console.log(selectedGameId);
    console.log('updating data')

    // update data on page
    var url = `http://localhost:8000/team-analysis/${this.selectedTeam.id}/${this.selectedGameId}`
    this.http.get<any>(url).subscribe(
      response => {
        console.log(response);
        this.lineStats = response as LineStatsItem[];
        console.log(this.lineStats);
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
