import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDashboard } from './dashboard';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MovieService } from '../../core/services/movie.service';
import { of } from 'rxjs';

describe('UserDashboard', () => {
  let component: UserDashboard;
  let fixture: ComponentFixture<UserDashboard>;
  let movieService: any;
  let router: Router;

  beforeEach(async () => {
    const movieMock = {
      getAllMovies: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UserDashboard],
      providers: [
        provideRouter([]),
        { provide: MovieService, useValue: movieMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboard);
    component = fixture.componentInstance;

    movieService = TestBed.inject(MovieService);
    router = TestBed.inject(Router);

    // ✅ mock initial API
    movieService.getAllMovies.mockReturnValue(of([]));

    fixture.detectChanges(); // triggers ngOnInit
  });

  // ✅ 1. Create
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ 2. loadMovies
  it('should load movies from service', () => {
    const mockMovies = [{ movieName: 'KGF' }];

    movieService.getAllMovies.mockReturnValue(of(mockMovies));

    component.loadMovies();

    expect(component.movies.length).toBe(1);
    expect(component.filteredMovies.length).toBe(1);
  });

  // ✅ 3. searchMovies (filter)
  it('should filter movies based on search text', () => {
    component.movies = [
      { movieName: 'KGF' },
      { movieName: 'RRR' }
    ];

    component.searchText = 'kgf';
    component.searchMovies();

    expect(component.filteredMovies.length).toBe(1);
    expect(component.filteredMovies[0].movieName).toBe('KGF');
  });

  // ✅ 4. searchMovies empty
  it('should reset filter when search text is empty', () => {
    component.movies = [
      { movieName: 'KGF' },
      { movieName: 'RRR' }
    ];

    component.searchText = '';
    component.searchMovies();

    expect(component.filteredMovies.length).toBe(2);
  });

  // ✅ 5. book navigation
  it('should navigate to booking page with movie and theatre', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.book('KGF', 'PVR');

    expect(navSpy).toHaveBeenCalledWith(['/booking', 'KGF', 'PVR']);
  });
 
  // ✅ 6. viewBookings navigation
  it('should navigate to my-bookings page', () => {
    const navSpy = vi.spyOn(router, 'navigate');

    component.viewBookings();

    expect(navSpy).toHaveBeenCalledWith(['/my-bookings']);
  });

});
