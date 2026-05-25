import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../core/services/api-endpoints';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboard implements OnInit {

  movies: any[] = [];

  newMovie = {
    movieName: '',
    theatreName: '',
    totalTickets: 0
  };

  successMessage: string = '';
  errorMessage: string = '';

  private baseUrl = API_ENDPOINTS.BASE;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  showMessage(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = '';
    } else {
      this.errorMessage = message;
      this.successMessage = '';
    }
  }

  loadMovies() {
    this.http.get<any[]>(
      `${this.baseUrl}${API_ENDPOINTS.MOVIES.GET_ALL}`
    ).subscribe(res => {
      this.movies = res;   
      this.cdr.detectChanges();
    });
  }

  addMovie() {
    this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.MOVIES.ADD}`,
      this.newMovie,
      { responseType: 'text' }
    ).subscribe({
      next: (response) => {
        this.showMessage(response, 'success');
        this.newMovie = { movieName: '', theatreName: '', totalTickets: 0 };
        this.loadMovies();
        this.cdr.detectChanges();
      }
    });
  }

  markAsap(movie: any) {
    this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.MOVIES.UPDATE_STATUS(movie.movieName, movie.theatreName)}`,
      null,
      {
        params: { status: 'BOOK_ASAP' },
        responseType: 'text'
      }
    ).subscribe({
      next: (response) => {
        this.showMessage(response, 'success');
        movie.status = 'BOOK_ASAP';
        this.cdr.detectChanges();
      }
      , error: () => this.showMessage("Failed to update status ❌", 'error')
    });
  }


  markSold(movie: any) {
    this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.MOVIES.UPDATE_STATUS(movie.movieName, movie.theatreName)}`,
      null,
      {
        params: { status: 'SOLD_OUT' },
        responseType: 'text'
      }
    ).subscribe({
      next: (response) => {
        this.showMessage(response, 'success');
        movie.status = 'SOLD_OUT';
        this.cdr.detectChanges();
      },
      error: () => this.showMessage("Failed to update status ❌", 'error')
    });
  }
  refresh() {
    this.loadMovies();
    this.showMessage("Refreshed 🔄", 'success');
    this.cdr.detectChanges();
  }
  delete(movie: any) {
    this.http.delete(
      `${this.baseUrl}${API_ENDPOINTS.MOVIES.DELETE(movie.movieName, movie.theatreName)}`,
      { responseType: 'text' }
    ).subscribe({
      next: (response) => {
        this.showMessage(response, 'success');
        this.loadMovies();
        this.cdr.detectChanges();
      },
      error: () => this.showMessage("Delete failed ❌", 'error')
    });
  }
}