import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-analysis-game-summary',
  templateUrl: './team-analysis-game-summary.component.html',
  styleUrls: ['./team-analysis-game-summary.component.scss']
})
export class TeamAnalysisGameSummaryComponent implements OnInit {

  @Input() gameSummary: any = []

  constructor() { }

  ngOnInit(): void {
  }

  setStyleLeftBar(s: any) {
    let val1 = eval(s.statValueTeam1);
    let val2 = eval(s.statValueTeam2);
    let width = Math.min((val1 / (val1 + val2)) * 40 - 0.25, 39.5);
    
    // if statistics are equal, set both bars to be the same width
    if (val1 == 0 && val2 == 0) {
      width = 39.5 / 2;
    }

    // if the other statistic is zero, set this bar to be the full width
    if (val2 == 0) {
      width = 40;
    }

    let styles = {
      'border-bottom': '2px solid', 
      'border-color': s.statColorTeam1, 
      'border-radius': '12px', 
      'width': width + 'vw',
      'display': 'inline-block'
    };
    return styles;
  }

  setStyleMidBar(s: any) {
    let val1 = eval(s.statValueTeam1)
    let val2 = eval(s.statValueTeam2)
    let width = 0.5
    if ((val1 == 0 || val2 == 0) && !(val1 == 0 && val2 == 0)) {
      width = 0;
    }

    let styles = {
      'width': width + 'vw',
      'display': 'inline-block'
    }
    return styles;
  }

  setStyleRightBar(s: any) {
    let val1 = eval(s.statValueTeam1);
    let val2 = eval(s.statValueTeam2);
    let width = Math.min((val2 / (val1 + val2)) * 40 - 0.25, 39.5);

    // if statistics are equal, set both bars to be the same width
    if (val1 == 0 && val2 == 0) {
      width = 39.5 / 2;
    }

    // if the other statistic is zero, set this bar to be the full width
    if (val1 == 0) {
      width = 40;
    }

    let styles = {
      'border-bottom': '2px solid', 
      'border-color': s.statColorTeam2, 
      'border-radius': '12px', 
      'width': width  + 'vw',
      'display': 'inline-block'
    };
    return styles;
  }
}
