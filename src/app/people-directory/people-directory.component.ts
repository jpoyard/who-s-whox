import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { WinnerService } from '../winner.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ox-people-directory',
  template: `
<mat-form-field>
  <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filtrer">
</mat-form-field>

<div class='mat-elevation-z8'>
  <mat-table #table [dataSource]='dataSource' matSort aria-label='Elements'>

    <!-- Entity Column -->
    <ng-container matColumnDef='entity'>
      <mat-header-cell *matHeaderCellDef mat-sort-header>Entité</mat-header-cell>
      <mat-cell *matCellDef='let row'>{{row.entity}}</mat-cell>
    </ng-container>

    <!-- Name Column -->
    <ng-container matColumnDef='name'>
      <mat-header-cell *matHeaderCellDef mat-sort-header>Nom</mat-header-cell>
      <mat-cell *matCellDef='let row'>{{row.name}}</mat-cell>
    </ng-container>

    <!-- Forname Column -->
    <ng-container matColumnDef='forname'>
      <mat-header-cell *matHeaderCellDef mat-sort-header>Prénom</mat-header-cell>
      <mat-cell *matCellDef='let row'>{{row.forname}}</mat-cell>
    </ng-container>

    <!-- Email Column -->
    <ng-container matColumnDef='email'>
      <mat-header-cell *matHeaderCellDef mat-sort-header>Email</mat-header-cell>
      <mat-cell *matCellDef='let row'>{{row.email}}</mat-cell>
    </ng-container>

     <!-- PhoneNumber Column -->
     <ng-container matColumnDef='phoneNumber'>
      <mat-header-cell *matHeaderCellDef mat-sort-header>Téléphone</mat-header-cell>
      <mat-cell *matCellDef='let row'>{{row.phoneNumber}}</mat-cell>
    </ng-container>

    <mat-header-row *matHeaderRowDef='displayedColumns'></mat-header-row>
    <mat-row *matRowDef='let row; columns: displayedColumns;' (click)="view(row)"></mat-row>
  </mat-table>

  <mat-paginator #paginator
    [pageSizeOptions]='[25, 50, 100, 250]'>
  </mat-paginator>
</div>

<router-outlet></router-outlet>
`,
  styles: [
    `
mat-row:hover{
  cursor: pointer;
}`
  ]
})
export class PeopleDirectoryComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<whoswhox.IWinner>();
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'entity',
    // 'displayName',
    'forname',
    'name'
    // 'photoURL',
    // 'email',
    // 'phoneNumber'
  ];

  constructor(
    private winnerService: WinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.winnerService.winners
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: whoswhox.IWinner[]) => (this.dataSource.data = data));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  view(winner: whoswhox.IWinner) {
    this.router.navigate([winner.id], {
      relativeTo: this.route
    });
  }
}
