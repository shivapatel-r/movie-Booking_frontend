import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingComponent } from './booking';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BookingComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        provideRouter([]),
        
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'movieName') return 'KGF';
                if (key === 'theatreName') return 'INOX';
                return null;
              }
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    // ✅ handle ngOnInit GET call
    const req = httpMock.expectOne(() => true);
    req.flush([
      {
        theatreName: 'INOX',
        seats: [{ seatNumber: 'A1', status: 'AVAILABLE' }]
      }
    ]); 
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.movieName).toBe('KGF');
    expect(component.theatreName).toBe('INOX');
    expect(component.seats.length).toBeGreaterThan(0);
  });
 
  it('should toggle seat', () => {
    const seat = { seatNumber: 'A1', status: 'AVAILABLE' };
    component.numberOfTickets = 1;

    component.toggleSeat(seat);

    expect(component.selectedSeats).toContain('A1');
    expect(component.errorMessage).toBe('');
  });

  it('should prevent selecting extra seats', () => {
    component.numberOfTickets = 1;
    component.selectedSeats = ['A1'];

    component.toggleSeat({ seatNumber: 'A2', status: 'AVAILABLE' });

    expect(component.errorMessage).toContain('Select only 1 seats');
  });

  it('should validate booking when seat count mismatch', () => {
    component.numberOfTickets = 2;
    component.selectedSeats = ['A1'];

    component.bookTickets();

    expect(component.errorMessage).toContain('Select exactly 2 seats');
  });

  it('should book successfully and reload seats', () => {
    component.movieName = 'KGF';
    component.theatreName = 'INOX';
    component.numberOfTickets = 1;
    component.selectedSeats = ['A1'];

    component.bookTickets();

    // ✅ handle POST
    const postReq = httpMock.expectOne(req => req.method === 'POST');
    postReq.flush('Success');

    // ✅ handle GET after booking
    const getReq = httpMock.expectOne(req => req.method === 'GET');
    getReq.flush([
      {
        theatreName: 'INOX',
        seats: []
      }
    ]);

    expect(component.successMessage).toBe('Success');
    expect(component.errorMessage).toBe('');
    expect(component.selectedSeats.length).toBe(0);
  });
});
