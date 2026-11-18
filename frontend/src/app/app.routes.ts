import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { EmployeeDetailsComponent } from './pages/employee-details/employee-details.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employees/new',
    component: EmployeeFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employees/edit/:id',
    component: EmployeeFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employees/:id',
    component: EmployeeDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'departments',
    component: DepartmentListComponent,
    canActivate: [authGuard]
  },
  { path: '**', component: NotFoundComponent }
];
