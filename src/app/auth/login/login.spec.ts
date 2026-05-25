import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
      saveToken: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, Login],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should login as admin and navigate to /admin', () => {
    const mockToken = createMockJwt('ROLE_ADMIN');
    authServiceMock.login.mockReturnValue(of(mockToken));

    const navSpy = vi.spyOn(router, 'navigateByUrl');

    component.loginData = { loginId: 'admin123', password: 'password' };
    component.login();

    expect(authServiceMock.saveToken).toHaveBeenCalledWith(mockToken, 'ROLE_ADMIN');
    expect(navSpy).toHaveBeenCalledWith('/admin');
  });

  it('should login as user and navigate to /user', () => {
    const mockToken = createMockJwt('ROLE_USER');
    authServiceMock.login.mockReturnValue(of(mockToken));

    const navSpy = vi.spyOn(router, 'navigateByUrl');

    component.loginData = { loginId: 'user123', password: 'password' };
    component.login();

    expect(authServiceMock.saveToken).toHaveBeenCalledWith(mockToken, 'ROLE_USER');
    expect(navSpy).toHaveBeenCalledWith('/user');
  });

  it('should show alert on login failure', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Invalid')));

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.loginData = { loginId: 'bad', password: 'wrong' };
    component.login();

    expect(alertSpy).toHaveBeenCalledWith('Invalid credentials ❌');
  });
});

// Helper to create a fake JWT with role
function createMockJwt(role: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ role }));
  const signature = 'signature';
  return `${header}.${payload}.${signature}`;
}
