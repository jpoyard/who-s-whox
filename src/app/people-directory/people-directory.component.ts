import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { PeopleDirectoryDataSource } from './people-directory-datasource';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'ox-people-directory',
  template: `
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
    <mat-row *matRowDef='let row; columns: displayedColumns;'></mat-row>
  </mat-table>

  <mat-paginator #paginator
    [length]='dataSource.length'
    [pageIndex]='0'
    [pageSize]='50'
    [pageSizeOptions]='[25, 50, 100, 250]'>
  </mat-paginator>
</div>`,
  styles: []
})
export class PeopleDirectoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: PeopleDirectoryDataSource;

  constructor(private dataBase: AngularFireDatabase) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['entity', 'name', 'forname', 'email', 'phoneNumber'];

  ngOnInit() {
    this.dataSource = new PeopleDirectoryDataSource(
      this.paginator,
      this.sort,
      this.dataBase
    );
  }
}
