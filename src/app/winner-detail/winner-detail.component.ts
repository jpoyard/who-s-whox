import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ox-winner-detail',
  template: `
<ng-container *ngIf="winner">
  <mat-card>
    <mat-card-header>
      <img src="{{winner.photoURL}}" alt="winner.displayName">
      <mat-card-title>{{winner.displayName}}</mat-card-title>
      <mat-card-subtitle>{{winner.entity}}</mat-card-subtitle>
    </mat-card-header>
    <mat-card-content>
      <mat-form-field >
        <input matInput placeholder="email" disabled value="{{winner.email}}">
      </mat-form-field>
    </mat-card-content>
    <mat-card-actions>
    </mat-card-actions>
  </mat-card>
</ng-container>
  `,
  styles: [
    `
mat-card img {
  width: 80px;
  height: 80px;
}
mat-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
  `
  ]
})
export class WinnerDetailComponent implements OnInit {
  winner: whoswhox.IWinner;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe((data: { winner: whoswhox.IWinner }) => {
      this.winner = data.winner;
      if (!this.winner) {
        this.router.navigate(['/booking']);
      }
    });
  }
}
