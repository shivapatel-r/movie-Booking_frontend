import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../constants/validation.constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword {
  newPassword = '';
  confirmPassword = '';
  message = '';
  success = false;
  loading = false;
  patterns = VALIDATION_PATTERNS;
  messages = VALIDATION_MESSAGES;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef) 
     { }
  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.success = false;
      this.message = this.messages.PASSWORD_MISMATCH;
      return;
    }

    this.message = '';
    this.loading = true;

    this.authService.resetPassword(this.newPassword, this.confirmPassword)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.success = res.success;
          this.message = res.message;
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loading = false;
          this.success = false;
          this.message = err.error?.message || "Something went wrong!";
          this.cdr.detectChanges();
        }
      });
  }


}
