import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboard } from './dashboard';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AdminDashboard', () => {
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboard, HttpClientTestingModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;

    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    // ✅ handle ngOnInit → loadMovies()
    const req = httpMock.expectOne(req => req.method === 'GET');
    req.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ✅ 1. Component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ 2. loadMovies should set movies
  it('should load movies', () => {
    const mockMovies = [
      { movieName: 'KGF', theatreName: 'INOX' }
    ];

    component.loadMovies();

    const req = httpMock.expectOne(req => req.method === 'GET');
    req.flush(mockMovies);

    expect(component.movies.length).toBe(1);
    expect(component.movies[0].movieName).toBe('KGF');
  });

  // ✅ 3. addMovie should call POST and reset form
  it('should add movie and reset form', () => {
    component.newMovie = {
      movieName: 'RRR',
      theatreName: 'PVR',
      totalTickets: 100
    };

    component.addMovie();

    const req = httpMock.expectOne(req => req.method === 'POST');
    expect(req.request.body.movieName).toBe('RRR');

    req.flush('Success');

    // After success, loadMovies() is called again → handle GET
    const getReq = httpMock.expectOne(req => req.method === 'GET');
    getReq.flush([]);

    expect(component.newMovie.movieName).toBe('');
  });

  // ✅ 4. delete movie
  it('should delete movie', () => {
    const movie = { movieName: 'KGF', theatreName: 'INOX' };

    component.delete(movie);

    const req = httpMock.expectOne(req => req.method === 'DELETE');
    req.flush('Deleted');

    // loadMovies again
    const getReq = httpMock.expectOne(req => req.method === 'GET');
    getReq.flush([]);

    expect(component.successMessage).toContain('Deleted');
  });

  // ✅ 5. markAsap should update status
  it('should mark movie as BOOK_ASAP', () => {
    const movie: any = { movieName: 'KGF', theatreName: 'INOX' };

    component.markAsap(movie);

    const req = httpMock.expectOne(req => req.method === 'PUT');
    expect(req.request.params.get('status')).toBe('BOOK_ASAP');

    req.flush('Updated');

    expect(movie.status).toBe('BOOK_ASAP');
  });

  // ✅ 6. markSold should update status
  it('should mark movie as SOLD_OUT', () => {
    const movie: any = { movieName: 'KGF', theatreName: 'INOX' };

    component.markSold(movie);

    const req = httpMock.expectOne(req => req.method === 'PUT');
    expect(req.request.params.get('status')).toBe('SOLD_OUT');

    req.flush('Updated');

    expect(movie.status).toBe('SOLD_OUT');
  });

  // ✅ 7. refresh should reload movies
  it('should refresh movies', () => {
    component.refresh();

    const req = httpMock.expectOne(req => req.method === 'GET');
    req.flush([]);

    expect(component.successMessage).toContain('Refreshed');
  });

});