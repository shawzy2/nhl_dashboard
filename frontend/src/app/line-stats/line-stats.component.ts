import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { LineStatsDataSource, LineStatsItem } from './line-stats-datasource';

@Component({
  selector: 'app-line-stats',
  templateUrl: './line-stats.component.html',
  styleUrls: ['./line-stats.component.scss']
})
export class LineStatsComponent implements AfterViewInit, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LineStatsItem>;
  dataSource: LineStatsDataSource;


  EXAMPLE_DATA: LineStatsItem[] = [
    {
      name: 'FWD1',
      id: 1,
      player1: 'A. PanarinBread',
      player2: 'R. Strome', 
      player3: 'A. Copp', 
      headshot1: '/assets/teams/3/headshots/8478550.jpg',
      headshot2: '/assets/teams/3/headshots/8476458.jpg',
      headshot3: '/assets/teams/3/headshots/8477429.jpg',
      mp: 10.4,
      cf: 14,
      ca: 16,
      cr: -2,
      xgf: 2.2,
      xga: 1.7,
      xgr: 0.5
    },
    {
      name: 'FWD2',
      id: 2,
      player1: 'C. Kreider',
      player2: 'M. Zibanejad', 
      player3: 'F. Vatrano', 
      headshot1: '/assets/teams/3/headshots/8475184.jpg',
      headshot2: '/assets/teams/3/headshots/8476459.jpg',
      headshot3: '/assets/teams/3/headshots/8478366.jpg',
      mp: 9.6,
      cf: 12,
      ca: 10,
      cr: 2,
      xgf: 1.8,
      xga: 1.9,
      xgr: -0.1
    },
    {
      name: 'FWD3',
      id: 3,
      player1: 'A. Lafrenière',
      player2: 'F. Chytil', 
      player3: 'K. Kakko', 
      headshot1: '/assets/teams/3/headshots/8482109.jpg',
      headshot2: '/assets/teams/3/headshots/8480078.jpg',
      headshot3: '/assets/teams/3/headshots/8481554.jpg',
      mp: 8.5,
      cf: 9,
      ca: 12,
      cr: -3,
      xgf: 0.8,
      xga: 0.5,
      xgr: 0.3
    },
    {
      name: 'FWD4',
      id: 4,
      player1: 'B. Goodrow',
      player2: 'K. Rooney', 
      player3: 'R. Reaves', 
      headshot1: '/assets/teams/3/headshots/8476624.jpg',
      headshot2: '/assets/teams/3/headshots/8479291.jpg',
      headshot3: '/assets/teams/3/headshots/8471817.jpg',
      mp: 7.1,
      cf: 8,
      ca: 8,
      cr: 0,
      xgf: 0.5,
      xga: 0.4,
      xgr: 0.1
    }
  ];

  @Input() lineStats: LineStatsItem[] = this.EXAMPLE_DATA;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'name', 'headshots', 'mp', 'div1', 
    'cf', 'ca', 'cr', 'div2', 
    'xgf', 'xga', 'xgr'
  ];

  constructor() {
    console.log(this.lineStats);
    this.dataSource = new LineStatsDataSource(this.lineStats, 3);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('param changes', changes);
    if(!changes['lineStats'].firstChange) {
      this.dataSource = new LineStatsDataSource(this.lineStats, 3);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      console.log('change made');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
