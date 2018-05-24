import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WinnerService {
  private static readonly NAME = 'winners';

  private _winners$ = new BehaviorSubject<whoswhox.IWinner[]>([]);
  get winners(): Observable<whoswhox.IWinner[]> {
    return this._winners$.asObservable();
  }
  constructor(private dataBase: AngularFireDatabase) {
    this.dataBase
      .list<whoswhox.IWinner>(WinnerService.NAME)
      .valueChanges()
      .subscribe(
        (data: whoswhox.IWinner[]) => this._winners$.next(data),
        (error: any) => console.error(error)
      );
  }

  hasWinner(id: string): Observable<boolean> {
    const result = this._winners$
      .getValue()
      .filter((winner: whoswhox.IWinner) => winner.id.toString() === id);
    return from([result.length > 0]);
  }

  getWinner(id: string): Observable<whoswhox.IWinner> {
    const result = this._winners$
      .getValue()
      .filter((winner: whoswhox.IWinner) => winner.id.toString() === id);
    return from(result);
  }

  addWinner(winner: whoswhox.IWinner): void {
    this.dataBase.list(WinnerService.NAME).push(winner);
  }
}
