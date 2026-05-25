import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: any;

  beforeEach(async () => {
    const authMock = {
      logout: vi.fn(),
      isLoggedIn: vi.fn(() => true),
      getRole: vi.fn(() => 'ROLE_USER') // ✅ FIX
    };

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout on AuthService', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
  });
});