import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class UserDashboard implements OnInit {

  movies: any[] = [];
  filteredMovies: any[] = [];
  searchText: string = '';

  constructor(
    private movieService: MovieService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}
 
  ngOnInit(): void {
    console.log("Dashboard Loaded ✅");
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe({
      next: (res: any[]) => {
        this.movies = res;
        this.filteredMovies = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  } 

  searchMovies() {
    if (!this.searchText) {
      this.filteredMovies = this.movies;
      return;
    } 

    this.filteredMovies = this.movies.filter(m =>
      m.movieName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  book(movieName: string, theatreName: string) {
    this.router.navigate(['/booking', movieName, theatreName]);
  }

  viewBookings() {
    this.router.navigate(['/my-bookings']);
  }
}