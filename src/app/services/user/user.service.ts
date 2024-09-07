import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Observable, catchError, throwError, from, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<User> | any;
  auth: string | any;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection("users").doc(user.uid).valueChanges();
        } else {
          return new Observable<User>();
        }
      })
    );
    this.auth = getAuth();
  }

  signUp(user: User): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then((credential) => {
        const userWithUid: User = {
          uid: user.uid,
          password: user.password,
          email: user.email,
          displayName: user.displayName,
        };

        return this.firestore.collection('users').doc(credential.user?.uid).set(userWithUid);
      });
  }

  getUid() {
    // Check if a user is signed in
    const user = this.auth.currentUser;

    if (user) {
      // User is signed in
      return user.uid;
    } else {
      // No user is signed in
      alert('No user signed in.');
      return null;
    }
  }

  // getUser(uid: string): Observable<User> | any {
  //   return this.firestore.collection("users").doc(uid).valueChanges();
  // }

  // updateUser(uid: string, data: Partial<User>): Promise<void> {
  //   return this.firestore.collection("users").doc(uid).update(data)
  // }

  getUserDetails(userId: string) {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState;
  }

  getUser(uid: string): Observable<any> {
    return this.firestore.doc(`users/${uid}`).valueChanges().pipe(
      catchError((error) => {
        console.error('Error getting user:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }

  updateUser(uid: string, userData: any): Observable<void> {
    return from(this.firestore.doc(`users/${uid}`).update(userData)).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }

  deleteUserAccount(): Observable<void> {
    return from(this.afAuth.currentUser).pipe(
      catchError((error) => {
        console.error('Error getting current user:', error);
        return throwError(error); // Rethrow the error
      }),
      switchMap((user) => {
        return from(user!.delete());
      }),
      catchError((error) => {
        console.error('Error deleting user account:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }

  deleteUser(uid: string): Observable<void> {
    return from(this.firestore.doc(`users/${uid}`).delete()).pipe(
      catchError((error) => {
        console.error('Error deleting user:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }

}
