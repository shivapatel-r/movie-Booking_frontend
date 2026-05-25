import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPassword } from './forgot-password';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('ForgotPassword Component', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let authServiceMock: any;

  beforeEach(async () => {
    // Simple mock object instead of jasmine.SpyObj
    authServiceMock = {
      forgotPassword: vi.fn()   // if using Vitest
      // or jest.fn() if using Jest
    };

    await TestBed.configureTestingModule({
  imports: [ForgotPassword, FormsModule, RouterTestingModule], // ✅ put component in imports
  providers: [{ provide: AuthService, useValue: authServiceMock }]
}).compileComponents();


    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if form is invalid', () => {
    const fakeForm: any = { invalid: true };
    component.forgot(fakeForm);
    expect(component.errorMessage).toContain(component.messages.FORM_INVALID);
    expect(component.successMessage).toBe('');
  });

  it('should show error if passwords do not match', () => {
    const fakeForm: any = { invalid: false };
    component.user.newPassword = 'abc';
    component.user.confirmPassword = 'xyz';
    component.forgot(fakeForm);
    expect(component.errorMessage).toContain(component.messages.PASSWORD_MISMATCH);
    expect(component.successMessage).toBe('');
  });

  it('should call AuthService and set successMessage on success', () => {
    const fakeForm: any = { invalid: false };
    component.user.username = 'testUser';
    component.user.newPassword = 'abc';
    component.user.confirmPassword = 'abc';

    authServiceMock.forgotPassword.mockReturnValue(of({ message: 'Password reset successful' }));

    component.forgot(fakeForm);

    expect(authServiceMock.forgotPassword).toHaveBeenCalledWith('testUser', 'abc', 'abc');
    expect(component.successMessage).toContain('Password reset successful');
    expect(component.errorMessage).toBe('');
  });

  it('should set errorMessage on service error', () => {
    const fakeForm: any = { invalid: false };
    component.user.username = 'testUser';
    component.user.newPassword = 'abc';
    component.user.confirmPassword = 'abc';

    authServiceMock.forgotPassword.mockReturnValue(
      throwError(() => ({ error: JSON.stringify({ message: 'Reset failed' }) }))
    );

    component.forgot(fakeForm);

    expect(component.errorMessage).toContain('Reset failed');
    expect(component.successMessage).toBe('');
  });
});
