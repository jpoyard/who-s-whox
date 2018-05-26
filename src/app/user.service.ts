import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth-types';
import { WinnerService } from './winner.service';
import { first, scan, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private afAuth: AngularFireAuth,
    private winnerService: WinnerService
  ) {
    this.afAuth.user
      .pipe(filter((user: User) => user !== null))
      .subscribe((user: User) => this.addUser(user));
  }
  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  get user(): Observable<User> {
    return this.afAuth.user;
  }

  private addUser(user: User): void {
    this.winnerService
      .hasWinnerWithThisEmail(user.email)
      .subscribe((hasWinner: boolean) => {
        if (!hasWinner) {
          this.winnerService.addWinner({
            id: user.uid,
            entity: 'Paris', // TODO
            displayName: user.displayName,
            forname: user.displayName.split(' ')[0],
            name: user.displayName.split(' ').reverse()[0],
            photoURL: user.photoURL,
            email: user.email,
            created: new Date().toLocaleString()
          });
        }
      });
  }
}
