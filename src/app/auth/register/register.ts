import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../constants/validation.constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  //common ngModl ngform 
  //form if for
  user = {
    firstName: '',
    lastName: '',
    email: '',
    loginId: '',
    password: '',
    confirmPassword: '',
    contactNumber: ''
  };

  successMessage: string = '';
  errorMessage: string = '';
  submitted = false;


  patterns = VALIDATION_PATTERNS;
  messages = VALIDATION_MESSAGES;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  register(form: NgForm) {

    this.submitted = true;

    if (form.invalid) {
      this.errorMessage = this.messages.FORM_INVALID;
      this.successMessage = '';
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = this.messages.PASSWORD_MISMATCH;
      this.successMessage = '';
      return;
    }

    this.auth.register(this.user).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || "Registration failed";
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }
}