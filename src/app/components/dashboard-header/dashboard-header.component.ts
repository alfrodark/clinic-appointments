import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent implements OnInit {

  userData: any;
  user!: User;

  constructor(
    private authService: AuthService,
    private auth: AngularFireAuth,
    private route: ActivatedRoute,) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((userData: any) => {
      this.user = userData;
    });
  }

  logout(): void {
    this.authService.signOut();
  }
}
