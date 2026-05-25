import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../constants/validation.constants';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {

  user = {
    username: '',
    newPassword: '',
    confirmPassword: ''
  };

  successMessage: string = '';
  errorMessage: string = '';
  submitted = false;
  loading = false;

  patterns = VALIDATION_PATTERNS;
  messages = VALIDATION_MESSAGES;

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  forgot(form: NgForm) {

    this.submitted = true;

    if (form.invalid) {
      this.errorMessage = this.messages.FORM_INVALID;
      this.successMessage = '';
      return;
    }

    if (this.user.newPassword !== this.user.confirmPassword) {
      this.errorMessage = this.messages.PASSWORD_MISMATCH;
      this.successMessage = '';
      return;
    }

    this.auth.forgotPassword(this.user.username, this.user.newPassword, this.user.confirmPassword).subscribe({
      next: (res: any) => {
        const parsed = typeof res === 'string' ? JSON.parse(res) : res;
        this.successMessage = "✅ " + parsed.message;
        this.errorMessage = '';
      },

      error: (err) => {
        let parsedError;
        try {
          parsedError = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
        } catch {
          parsedError = null;
        }
        this.errorMessage = parsedError?.message || "Password reset failed ❌";
        this.successMessage = '';
      }

    });
  }
}