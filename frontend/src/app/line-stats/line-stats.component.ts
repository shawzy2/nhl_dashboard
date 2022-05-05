import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { LineStatsDataSource, LineStatsItem } from './line-stats-datasource';

@Component({
  selector: 'app-line-stats',
  templateUrl: './line-stats.component.html',
  styleUrls: ['./line-stats.component.scss']
})
export class LineStatsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LineStatsItem>;
  dataSource: LineStatsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'name', 'headshots', 'mp', 'div1', 
    'cf', 'ca', 'cr', 'div2', 
    'xgf', 'xga', 'xgr'
  ];

  constructor() {
    this.dataSource = new LineStatsDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
