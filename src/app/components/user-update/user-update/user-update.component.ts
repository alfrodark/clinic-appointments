import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { finalize, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent implements OnInit {

  updateUserForm!: FormGroup;
  userId!: string | any;
  user: Observable<User> | any;
  user$!: Observable<any>;
  selectedFile: File | any = null;
  currentUser: any;
  imageUrl!: string | ArrayBuffer | any;
  photoUrl!: string;

  uploadPercent!: number;
  downloadURL!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private userService: UserService,
    private storage: AngularFireStorage,
    private snackBar: MatSnackBar
  ) {
     this.updateUserForm = this.fb.group({
      uid: this.userId,
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {
    this.user$ = this.afAuth.authState;
    this.user$.subscribe(user => {
      if (user) {
        const uid = this.route.snapshot.paramMap.get('id') || user.uid;
        this.authService.getUserData(uid).subscribe((userData: any) => {
        this.user = userData;
        this.userId! = uid;
        this.initForm();
        this.loadUserData();
      });
      } else {
        console.log('No user is logged in.');
      }

    });
  }

  private initForm(): void {
    this.updateUserForm = this.fb.group({
      uid: this.userId,
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      photoUrl: [''],
    });
  }

  loadUserData(): void {
    this.afAuth.user.subscribe(user => {
      const uid = this.route.snapshot.paramMap.get('id') || user!.uid;
      this.authService.getUserData(uid!).subscribe((userData: any) => {
        this.user = userData;
        this.updateUserForm.patchValue(this.user);
      });
    });

  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const filePath = `user-images/${this.userId}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe((percent: number| any) => {
      this.uploadPercent = percent;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url: string) => {
          this.downloadURL = url;
          this.updateUserForm.patchValue({ photoUrl: url });
        });
      })
    ).subscribe();
  }

  onSubmit(): void {
    const formData = this.updateUserForm.value;
    if (this.userId) {
      this.authService.saveUserData(this.userId, formData).then(() => {
        alert('User updated successfully!');
      }).catch(error => {
        alert('Error updating user profile:'+{error});
      });

      this.router.navigate(['/home']);
    } else {

    }
  }



}
