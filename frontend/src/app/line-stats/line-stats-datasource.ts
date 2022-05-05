import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface LineStatsItem {
  name: string;
  id: number;
  player1: string;
  player2: string;
  player3: string;
  headshot1: string;
  headshot2: string;
  headshot3: string;
  mp: number;
  cf: number;
  ca: number;
  cr: number;
  xgf: number;
  xga: number;
  xgr: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: LineStatsItem[] = [
  {
    name: 'FWD1',
    id: 1,
    player1: 'A. Panarin',
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

/**
 * Data source for the LineStats view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LineStatsDataSource extends DataSource<LineStatsItem> {
  data: LineStatsItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
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
