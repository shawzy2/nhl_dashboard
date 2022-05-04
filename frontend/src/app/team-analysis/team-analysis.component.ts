import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-team-analysis',
  templateUrl: './team-analysis.component.html',
  styleUrls: ['./team-analysis.component.scss']
})
export class TeamAnalysisComponent {
  selectedTeam = { name: 'NHL',   id: '0' }
  selectedGameId = 0

  teams = [
    { name: 'Anaheim Ducks',   id: '24' },
    { name: 'Arizona Coyotes', id: '53' },
    { name: 'Boston Bruins',   id: '6' },
    { name: 'Pittsburgh Penguins',   id: '5' },
    { name: 'New York Rangers',   id: '3' }
  ]
  gameIds = [2021020001, 2021020002, 2021020003];

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

  constructor(private breakpointObserver: BreakpointObserver) {}
}
