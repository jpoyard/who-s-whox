import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'ox-root',
  template: `
<div *ngIf="(user | async) as user; else showLogin">
  <mat-toolbar color="primary">
    <span>Who's whOX</span>
    <!-- This fills the remaining space of the current row -->
    <span class="fill-remaining-space"></span>
    <img height="42" width="42" src="{{ user.photoURL }}" alt="{{ user.displayName }}">
    <span>{{ user.displayName }}</span>
    <mat-icon aria-label="logout" (click)="logout()">exit_to_app</mat-icon>
  </mat-toolbar>
  <router-outlet></router-outlet>
</div>
<ng-template #showLogin>
  <p>Please login.</p>
  <button (click)="login()">Login with Google</button>
</ng-template>
  `,
  styles: [
    `
  mat-toolbar  img {
    margin: 10px;
    border-radius: 100%;
  }
  mat-toolbar .fill-remaining-space {
    /* This fills the remaining space, by using flexbox.
        Every toolbar row uses a flexbox row layout. */
    flex: 1 1 auto;
  }

  mat-toolbar mat-icon {
    margin: 5px;
    cursor: pointer;
  }
  `
  ]
})
export class AppComponent {
  title = 'ox';
  constructor(public userService: UserService) {}
  login() {
    this.userService.login();
  }
  logout() {
    this.userService.logout();
  }
  get user(): Observable<User> {
    return this.userService.user;
  }
}
