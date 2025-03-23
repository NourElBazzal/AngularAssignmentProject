import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'student', password: 'student123', role: 'student' }
  ];

  login(username: string, password: string): boolean {
    console.log('Entered Username:', username);
    console.log('Entered Password:', password);
    const user = this.users.find(
      u => u.username.toLowerCase() === username.toLowerCase() &&
           u.password === password
    );
    if (user) {
      console.log('User found:', user);
      localStorage.setItem('token', 'test_token');
      localStorage.setItem('role', user.role);
      return true;
    }
    console.log('Invalid credentials');
    return false;
  }
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isStudent(): boolean {
    return this.getRole() === 'student';
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
