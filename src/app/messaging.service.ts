import { Injectable } from '@angular/core';
import firebase from '@firebase/app';
import '@firebase/messaging';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { take } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messaging = firebase.messaging();
  private _currentMessage = new BehaviorSubject(null);
  public get currentMessage() {
    return this._currentMessage.asObservable();
  }

  constructor(
    private database: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {}

  updateToken(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        const data = { [user.uid]: token };
        this.database.object('fcmTokens/').update(data);
      }
    });
  }

  getPermission() {
    this.messaging
      .requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken();
      })
      .then(token => {
        console.log(token);
        this.updateToken(token);
      })
      .catch(err => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  receiveMessage() {
    this.messaging.onMessage(payload => {
      console.log('Message received. ', payload);
      this._currentMessage.next(payload);
    });
  }

  pushMessage(winner: whoswhox.IWinner): void {
    console.log(firebase.apps);
    console.log(winner);
    const data = {
      [winner.id]: {
        title: `Un message de ${winner.displayName}`,
        body: `coucou tout le monde! ${winner.forname}`,
        icon: winner.photoURL
      }
    };
    this.database.object('messages/').update(data);
  }
}
