import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from '../../core/services/api-endpoints';


@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.css']
})
export class MyBookingsComponent implements OnInit {

  bookings: any[] = [];

  private baseUrl = API_ENDPOINTS.BASE;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.loadBookings();
  }


  loadBookings() {
    this.http.get<any[]>(
      `${this.baseUrl}${API_ENDPOINTS.BOOKING.VIEW}`
    ).subscribe({
      next: (res) => {
      this.bookings = res;
      this.cdr.detectChanges();
      },
      error: (error) => {
      alert('Failed to load bookings.');
      console.error(error);
      }
    });
  }

}