import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, take, tap, filter } from 'rxjs/operators';
import { $ } from 'protractor';
import { MessagingService } from './messaging.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '@firebase/auth-types';

@Injectable({
  providedIn: 'root'
})
export class WinnerService {
  private static readonly NAME = '/winners';
  private winnersRef: AngularFireList<whoswhox.IWinner>;
  public winners: Observable<whoswhox.IWinner[]>;
  constructor(
    private dataBase: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private messagingService: MessagingService
  ) {
    this.afAuth.user.subscribe((user: User) => {
      if (user && user !== null) {
        this.addWinner(user);
        this.winnersRef = this.dataBase.list<whoswhox.IWinner>(
          WinnerService.NAME
        );
        this.winners = this.winnersRef.valueChanges();
      }
    });

    this.winnersRef = this.dataBase.list<whoswhox.IWinner>(WinnerService.NAME);
    this.winners = this.winnersRef.valueChanges();
  }

  private addWinner(user: User): void {
    this.getWinner(user.uid)
      .pipe(filter(value => !value || value === null))
      .subscribe(() => {
        const winner: whoswhox.IWinner = {
          id: user.uid,
          entity: 'Paris', // TODO
          displayName: user.displayName,
          forname: user.displayName.split(' ')[0],
          name: user.displayName.split(' ').reverse()[0],
          photoURL: user.photoURL,
          email: user.email,
          created: new Date().toLocaleString()
        };
        this.winnersRef.push(winner);
        this.messagingService.pushMessage(winner);
      });
  }

  getWinner(id: string): Observable<whoswhox.IWinner> {
    return this.dataBase
      .list<whoswhox.IWinner>(WinnerService.NAME, ref => ref.orderByChild('id'))
      .valueChanges()
      .pipe(
        map(values => values.filter(value => value.id === id)),
        map(values => values[0])
      );
  }
}
