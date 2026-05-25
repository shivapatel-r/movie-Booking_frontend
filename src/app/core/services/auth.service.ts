import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from './api-endpoints';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = API_ENDPOINTS.BASE;

  constructor(private http: HttpClient, private router: Router) { }


  login(data: any) {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
      data,
      { responseType: 'text' }
    );
  }

  register(data: any) {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`,
      data
    );
  }

  forgotPassword(username: string, newPassword: string, confirmPassword: string) {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT}`,
      { username, newPassword, confirmPassword },
      { responseType: 'text' }
    );
  }

  resetPassword(newPassword: string, confirmPassword: string) {
    const body = { newPassword, confirmPassword };
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.RESET}`,
      body
    );
  }

  saveToken(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now().valueOf() / 1000;
      return decoded.exp > now;
    } catch (e) {
      return false;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}