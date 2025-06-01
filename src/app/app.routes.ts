import { Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments/assignments.component';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment.component';
import { CoursesComponent } from './courses/courses.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', component: AssignmentsComponent }, 
  { path: 'assignment/:id', component: AssignmentDetailComponent }, 
  { path: 'courses', component: CoursesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add', component: AddAssignmentComponent }, 
  { path: 'assignment/:id/edit', component: EditAssignmentComponent, canActivate: [AuthGuard] },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: '**', redirectTo: '' } 
];
