import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../constants/validation.constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login { 

  loginData = {
    loginId: '',
    password: ''
  };
   patterns = VALIDATION_PATTERNS;
    messages = VALIDATION_MESSAGES;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
  
    this.auth.login(this.loginData).subscribe({
      next: (res: any) => {

        const token = res;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;

  
        this.auth.saveToken(token, role);

        if (role === 'ROLE_ADMIN') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/user');
        }

      },
      error: (err) => {
        console.error(err);
        alert("Invalid credentials ❌");
      }
    });
  }
}