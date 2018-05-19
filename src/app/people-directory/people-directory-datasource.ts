import { DataSource } from "@angular/cdk/collections";
import { MatPaginator, MatSort } from "@angular/material";
import { map } from "rxjs/operators";
import { Observable, of as observableOf, merge } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import { Inject } from "@angular/core";

// TODO: Replace this with your own data model type
export interface PeopleDirectoryItem {
  entity: string;
  forname: string;
  name: string;
}

/**
 * Data source for the PeopleDirectory view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PeopleDirectoryDataSource extends DataSource<PeopleDirectoryItem> {
  data: PeopleDirectoryItem[] = [];

  constructor(
    private paginator: MatPaginator,
    private sort: MatSort,
    private db: AngularFirestore
  ) {
    super();
    db
      .collection<PeopleDirectoryItem>(`/winners`)
      .valueChanges()
      .subscribe(
        (winners: PeopleDirectoryItem[]) => (this.data = winners),
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
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginators length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(
      map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
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
    if (!this.sort.active || this.sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (this.sort.active) {
        case "entity":
          return compare(a.entity, b.entity, isAsc);
        case "name":
          return compare(a.name, b.name, isAsc);
        case "forname":
          return compare(a.forname, b.forname, isAsc);
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
