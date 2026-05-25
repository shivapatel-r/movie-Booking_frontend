import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MyBookingsComponent } from './my-bookings';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('MyBookingsComponent', () => {
  let component: MyBookingsComponent;
  let fixture: ComponentFixture<MyBookingsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => { 
    await TestBed.configureTestingModule({
      imports: [MyBookingsComponent, HttpClientTestingModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookingsComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    // ✅ handle ngOnInit → loadBookings()
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

  // ✅ 2. Should load bookings
  it('should load bookings from API', () => {
    const mockBookings = [
      { id: 1, movieName: 'KGF' }
    ];

    component.loadBookings();

    const req = httpMock.expectOne(req => req.method === 'GET');
    req.flush(mockBookings);

    expect(component.bookings.length).toBe(1);
    expect(component.bookings[0].movieName).toBe('KGF');
  });

});