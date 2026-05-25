import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Register } from './register';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      register: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } } // ✅ fix missing provider
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should show error if form is invalid', () => {
    const mockForm = { invalid: true } as any;
    component.register(mockForm);
    expect(component.errorMessage).toBe(component.messages.FORM_INVALID);
  });

  
  it('should show error if passwords do not match', () => {
    const mockForm = { invalid: false } as any;
    component.user.password = '123';
    component.user.confirmPassword = '456';
    component.register(mockForm);
    expect(component.errorMessage).toBe(component.messages.PASSWORD_MISMATCH);
  });


  it('should handle registration error', () => {
    const mockForm = { invalid: false } as any;
    component.user.password = '123';
    component.user.confirmPassword = '123';

    authServiceMock.register.mockReturnValue(
      throwError(() => ({ error: { message: 'User already exists' } }))
    );

    component.register(mockForm);

    expect(component.errorMessage).toContain('User already exists');
    expect(component.successMessage).toBe('');
  });
});
