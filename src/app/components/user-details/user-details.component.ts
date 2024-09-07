import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

  user!: User;
  user$!: Observable<any>;

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user$ = this.afAuth.authState;
    this.user$.subscribe((user) => {
      if (user) {
        const uid = this.route.snapshot.paramMap.get('id') || user.uid;
        this.authService.getUserData(uid).subscribe((userData: any) => {
        this.user = userData;
      });
      } else {
        console.log('No user is logged in.');
      }
    });
  }

}
