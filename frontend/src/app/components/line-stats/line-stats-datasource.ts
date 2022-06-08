import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Input } from '@angular/core';
import { TeamAnalysisComponent } from '../../team-analysis/team-analysis.component'
import { HttpClient } from '@angular/common/http';


interface PlayerItem {
  name: string;
  playerId: number;
}

export interface LineStatsItem {
  name: string;
  id: number;
  players: PlayerItem[];
  mp: number;
  cf: number;
  ca: number;
  cr: number;
  xgf: number;
  xga: number;
  xgr: number;
}

/**
 * Data source for the LineStats view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LineStatsDataSource extends DataSource<LineStatsItem> {
  // @Input() lineStats: any;
  // data: LineStatsItem[] = EXAMPLE_DATA;
  data: LineStatsItem[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  

  constructor(lineStatss: LineStatsItem[], num: any) {
    super();
    this.data = lineStatss;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<LineStatsItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: LineStatsItem[]): LineStatsItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: LineStatsItem[]): LineStatsItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'mp': return compare(+a.mp, +b.mp, isAsc);
        case 'cf': return compare(+a.cf, +b.cf, isAsc);
        case 'ca': return compare(+a.ca, +b.ca, isAsc);
        case 'cr': return compare(+a.cr, +b.cr, isAsc);
        case 'xgf': return compare(+a.xgf, +b.xgf, isAsc);
        case 'xga': return compare(+a.xga, +b.xga, isAsc);
        case 'xgr': return compare(+a.xgr, +b.xgr, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
