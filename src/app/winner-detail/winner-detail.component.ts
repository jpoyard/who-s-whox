import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ox-winner-detail',
  template: `
    <p>
      winner-detail works!
      {{winner |json}}
    </p>
  `,
  styles: []
})
export class WinnerDetailComponent implements OnInit {
  winner: whoswhox.IWinner;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe((data: { winner: whoswhox.IWinner }) => {
      this.winner = data.winner;
    });
  }
}
