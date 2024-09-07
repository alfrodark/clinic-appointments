import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  signUpForm: FormGroup;
  user: User = {uid: '', email: '', password: '', displayName: '' };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signUpForm = this.formBuilder.group({
      displayName:['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  signUp() {
    if (this.signUpForm.valid) {
      const displayName = this.signUpForm.get('displayName')!.value;
      const email = this.signUpForm.get('email')!.value;
      const password = this.signUpForm.get('password')!.value;
      this.authService.signUp(displayName, email, password)
      .then(() => {
        alert("You have successfully signed up.");
        this.router.navigate(['/login']);
      })
      .catch((error: any) => {
        console.error('Error during sign-up:', error);
        alert('Sign-up error:'+(error));
      });
    }
  }

}
