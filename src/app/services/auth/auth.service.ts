import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$!: Observable<firebase.default.User> | any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.user$ = afAuth.authState;

      this.user$ = afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.getUserData(user.uid);
          } else {
            return [];
          }
        })
      );
   }

   getUserData(userId: string): Observable<any> {
    return this.afs.collection('users').doc(userId).valueChanges();
  }

  getCurrentUser(): Observable<any> {
    return this.user$;
  }

  getUserUid(): string | any {
    let uid = null;
    this.user$.subscribe((user: { uid: any; }) => {
      if (user) {
        uid = user.uid;
      }
    });
    return uid;
  }

  // Sign up
  // signUp(email: string, password: string): Promise<void> {
  //   return this.afAuth.createUserWithEmailAndPassword(email, password)
  //     .then(() => {
  //       this.router.navigate(['/login']);
  //     })
  //     .catch((error) => {
  //       this.snackBar.open(error.message, 'Close', { duration: 5000 });
  //     });
  // }

  // async signUp(email: string, password: string): Promise<void> {
  //   try {
  //     const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
  //     await this.updateUserData(userCredential.user);
  //     // Redirect to dashboard or home page after successful sign up
  //     this.router.navigate(['/login']);
  //     alert('Successfully signed up.');
  //   } catch (error) {
  //     console.error('Error signing up:', error);
  //     alert('Error signing up.');
  //     // Handle error, display message to user, etc.
  //   }
  // }

  signUp(name: string, email: string, password: string): Promise<void> {
      // Step 1: Create user in Firebase Authentication
      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          // Step 2: Save additional user data in Firestore
          const userId = result.user?.uid;

          if (userId) {
            const userData = {email, userId, name};

            return this.saveUserData(userId, userData);
          } else {
            throw new Error('User ID not available in sign-up result.');
          }
        })
        .then(() => {
          // Step 3: Redirect or perform other actions on successful sign-up
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          // Handle sign-up error
          console.error('Sign-up error:', error);
          throw error; // Re-throw the error for the component to handle
        });
    }

  // Login
  // login(email: string, password: string): Promise<void> {
  //   return this.afAuth.signInWithEmailAndPassword(email, password)
  //     .then(() => {
  //       this.router.navigate(['/home']);
  //     })
  //     .catch((error) => {
  //       this.snackBar.open(error.message, 'Close', { duration: 5000 });
  //     });

  // }

  async login(email: string, password: string): Promise<void> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(credential.user);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error Signing In.');

    }
  }

  // Logout
  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out:');
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.afAuth.authState;
  }

  saveUserData(userId: string, userData: any): Promise<void> {
    return this.afs.collection('users').doc(userId).set(userData);
  }

  private async updateUserData(user: any): Promise<void> {
    const userRef = this.afs.collection('users').doc(user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoUrl,
    };
    return userRef.set(userData, { merge: true });
  }


}
