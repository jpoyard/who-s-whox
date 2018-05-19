import { Component } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';

@Component({
  selector: "ox-root",
  template: `
<div *ngIf="afAuth.user | async as user; else showLogin">
  <h1>Hello {{ user.displayName }}!</h1>
  <button (click)="logout()">Logout</button>
  <router-outlet></router-outlet>
</div>
<ng-template #showLogin>
  <p>Please login.</p>
  <button (click)="login()">Login with Google</button>
</ng-template>
  `,
  styles: []
})
export class AppComponent {
  title = "ox";
  constructor(public afAuth: AngularFireAuth) {
  }
  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }
}
