import { Routes } from '@angular/router';
import { Login } from './auth/login/login';

import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { AdminDashboard } from './admin/dashboard/dashboard';
import { UserDashboard } from './user/dashboard/dashboard';
import { Register } from './auth/register/register';
import { BookingComponent } from './user/booking/booking';
import { MyBookingsComponent } from './user/my-bookings/my-bookings';
import { AuthGuard } from './core/services/auth.gaurd';
import { ResetPassword } from './auth/reset-password/reset-password';

export const routes: Routes = [
    { path: '', component: Login },

    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'forgot', component: ForgotPassword },
    {path: 'reset', component: ResetPassword },
  
    { path: 'admin', component: AdminDashboard, canActivate: [AuthGuard]  },
    { path: 'user', component: UserDashboard,canActivate: [AuthGuard]  },
    { path: 'booking/:movieName/:theatreName', component: BookingComponent,canActivate: [AuthGuard]  },
    { path: 'my-bookings', component: MyBookingsComponent,canActivate: [AuthGuard]  }
];
