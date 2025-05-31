import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8010/api/login';  // Unified login route

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string, role: 'student' | 'professor' | 'admin'): Observable<boolean> {
    return this.http.post<any>(this.apiUrl, { email, password, role }).pipe(
      tap(response => {
        const user = response.student || response.professor || response.admin;

        if (user) {
          localStorage.setItem('token', 'dummy-token'); // Replace with real JWT if added
          localStorage.setItem('role', role);
          localStorage.setItem('userId', user.id.toString());
          localStorage.setItem('userName', user.fullName || user.name || 'Admin');
        }
      }),
      map(response => !!(response.student || response.professor || response.admin)),
      catchError(error => {
        console.error('Login failed', error);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isStudent(): boolean {
    return this.getRole() === 'student';
  }

  isProfessor(): boolean {
    return this.getRole() === 'professor';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
