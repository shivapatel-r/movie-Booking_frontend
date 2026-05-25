import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { API_ENDPOINTS } from '../../core/services/api-endpoints';


@Component({ 
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {

  movieName!: string;
  theatreName!: string;

  seats: any[] = [];
  selectedSeats: string[] = [];
  numberOfTickets: number = 1;

  successMessage: string = '';
  errorMessage: string = '';

  private baseUrl = API_ENDPOINTS.BASE;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.movieName = params.get('movieName')!;
      this.theatreName = params.get('theatreName')!;
      this.loadSeats();
    });
  }
 

  loadSeats() {
    this.http.get<any[]>(
      `${this.baseUrl}${API_ENDPOINTS.MOVIES.SEARCH}/${this.movieName}`
    ).subscribe({
      next: (res) => {
        const movie = res.find(m => m.theatreName === this.theatreName);
        this.seats = [...movie.seats];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  toggleSeat(seat: any) {

    if (seat.status === 'BOOKED') return;

    const index = this.selectedSeats.indexOf(seat.seatNumber);

    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {

      if (this.selectedSeats.length >= this.numberOfTickets) {
        this.errorMessage = `Select only ${this.numberOfTickets} seats`;
        this.successMessage = '';
        return;
      }

      this.selectedSeats.push(seat.seatNumber);
    }

    this.errorMessage = '';
  }

  bookTickets() {

    if (this.selectedSeats.length !== this.numberOfTickets) {
      this.errorMessage = `Select exactly ${this.numberOfTickets} seats`;
      this.successMessage = '';
      return;
    }

    const payload = {
      movieName: this.movieName,
      theatreName: this.theatreName,
      numberOfTickets: this.numberOfTickets,
      seatNumbers: this.selectedSeats
    };

    this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.BOOKING.BOOK}`,
      payload,
      { responseType: 'text' }
    ).subscribe({
      next: (res) => {
        this.successMessage = res;
        this.errorMessage = '';
        this.selectedSeats = [];
        this.loadSeats();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Booking failed ❌";
        this.successMessage = '';
      }
    });
  }
}