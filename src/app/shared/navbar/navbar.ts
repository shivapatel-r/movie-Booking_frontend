import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ REQUIRED
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}