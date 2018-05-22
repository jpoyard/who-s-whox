import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, tap } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { Inject } from '@angular/core';

// TODO: Replace this with your own data model type
export interface PeopleDirectoryItem {
  entity: string;
  name: string;
  forname: string;
  displayName: string;
  photoURL: string;
  email: string;
  phoneNumber: string;
}

/**
 * Data source for the PeopleDirectory view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PeopleDirectoryDataSource extends DataSource<PeopleDirectoryItem> {
  private static readonly WINNERS_LIST_NAME = 'winners';
  private _winners$: BehaviorSubject<
    PeopleDirectoryItem[]
  > = new BehaviorSubject<PeopleDirectoryItem[]>([]);

  private _length = 0;
  public get length(): number {
    return this._length;
  }
  public get winners(): Observable<PeopleDirectoryItem[]> {
    return this._winners$.asObservable();
  }

  constructor(
    private paginator: MatPaginator,
    private sort: MatSort,
    private db: AngularFireDatabase
  ) {
    super();
    // db
    //   .collection<PeopleDirectoryItem>(`winners`)
    //   .valueChanges()

    this.db
      .list<PeopleDirectoryItem>(PeopleDirectoryDataSource.WINNERS_LIST_NAME)
      .valueChanges()
      .subscribe(
        (data: PeopleDirectoryItem[]) => this._winners$.next(data),
        (error: any) => console.error(error)
      );
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<PeopleDirectoryItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.winners,
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginators length
    this.winners.subscribe((data: PeopleDirectoryItem[]) => {
      this._length = data.length;
      this.paginator.length = data.length;
    });
    return merge(...dataMutations).pipe<PeopleDirectoryItem[]>(
      map(() => {
        return this.getPagedData(
          this.getSortedData([...this._winners$.getValue()])
        );
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: PeopleDirectoryItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: PeopleDirectoryItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'entity':
          return compare(a.entity, b.entity, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'forname':
          return compare(a.forname, b.forname, isAsc);
        case 'displayName':
          return compare(a.displayName, b.displayName, isAsc);
        case 'email':
          return compare(a.email, b.email, isAsc);
        case 'phoneNumber':
          return compare(a.phoneNumber, b.phoneNumber, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
