import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';
import { Observable, from, of } from 'rxjs';
import { User } from '@firebase/auth-types';
import { WinnerService } from './winner.service';
import { first, scan, filter, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loginInProgress = false;
  constructor(private afAuth: AngularFireAuth) {}
  login() {
    // this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.loginInProgress = true;
    // Sign in with redirect:
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    ////////////////////////////////////////////////////////////
    // The user is redirected to the provider's sign in flow...
    ////////////////////////////////////////////////////////////
    // Then redirected back to the app, where we check the redirect result:
    from(this.afAuth.auth.getRedirectResult())
      .pipe(
        tap(() => (this.loginInProgress = false)),
        catchError((error: any) => {
          this.loginInProgress = false;
          // The provider's account email, can be used in case of
          // auth/account-exists-with-different-credential to fetch the providers
          // linked to the email:
          const email = error.email;
          // The provider's credential:
          const credential = error.credential;
          // In case of auth/account-exists-with-different-credential error,
          // you can fetch the providers using this:
          if (error.code === 'auth/account-exists-with-different-credential') {
            this.afAuth.auth
              .fetchProvidersForEmail(email)
              .then(function(providers) {
                alert(error);
                // The returned 'providers' is a list of the available providers
                // linked to the email address. Please refer to the guide for a more
                // complete explanation on how to recover from this error.
              });
          }
          throw error;
        })
      )
      .subscribe(result => {
        this.loginInProgress = false;
        // The firebase.User instance:
        const user = result.user;
        // The Facebook firebase.auth.AuthCredential containing the Facebook
        // access token:
        const credential = result.credential;
        // As this API can be used for sign-in, linking and reauthentication,
        // check the operationType to determine what triggered this redirect
        // operation.
        const operationType = result.operationType;
      });
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  get user(): Observable<User> {
    return this.afAuth.user;
  }
}
