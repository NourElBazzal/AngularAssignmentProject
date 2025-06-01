import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8010/api';
  private backendBaseUrl = 'http://localhost:8010'; // Base URL for backend assets

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string, role: 'student' | 'professor' | 'admin'): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password, role }).pipe(
      tap(response => {
        const user = response.student || response.professor || response.admin;

        if (user) {
          localStorage.setItem('token', 'dummy-token'); // Replace with real JWT if added
          localStorage.setItem('role', role);
          localStorage.setItem('userId', user.id.toString());
          localStorage.setItem('userName', user.fullName || user.name || 'Admin');
          localStorage.setItem('userImage', user.image || 'https://ui-avatars.com/api/?name=Admin');
        }
      }),
      map(response => !!(response.student || response.professor || response.admin)),
      catchError(error => {
        console.error('Login failed', error);
        return of(false);
      })
    );
  }

  updateProfile(userId: string, name: string, password: string, image?: File | null): Observable<any> {
    const formData = new FormData();
    if (name.trim()) formData.append('name', name); // Only append if not empty
    if (password.trim()) formData.append('password', password); // Only append if not empty
    if (image) formData.append('image', image); // Only append if image exists
    formData.append('role', this.getRole() || '');

    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, formData).pipe(
      tap(response => {
        if (response.user) {
          localStorage.setItem('userName', response.user.fullName || response.user.name);
          const imageUrl = response.user.image || this.getUserImage();
          localStorage.setItem('userImage', imageUrl.startsWith('/uploads') ? `${this.backendBaseUrl}${imageUrl}` : imageUrl);
        }
      }),
      catchError(error => {
        console.error('Profile update failed', error);
        return of({ error: error.message });
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

  getUserImage(): string | null {
    const image = localStorage.getItem('userImage');
    return image && image.startsWith('/uploads') ? `${this.backendBaseUrl}${image}` : image;
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