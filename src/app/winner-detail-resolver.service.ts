import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { WinnerService } from './winner.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WinnerDetailResolverService implements Resolve<whoswhox.IWinner> {
  constructor(private winnerService: WinnerService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<whoswhox.IWinner> {
    const id = route.paramMap.get('id');

    return this.winnerService.getWinner(id).pipe(
      take(1),
      map(winner => {
        if (winner) {
          return winner;
        } else {
          // id not found
          this.router.navigate(['/booking']);
          return null;
        }
      })
    );
  }
}
