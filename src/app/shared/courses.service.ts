import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Course {
  _id: string;
  name: string;
  image: string;
  professors: { id: number; name: string; image: string }[];
  assignments: { id: number; name: string; dueDate: string; submitted: boolean; grade?: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:8010/api/students';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getStudentCourses(): Observable<Course[]> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('User not logged in');
    return this.http.get<Course[]>(`${this.apiUrl}/${userId}/courses`);
  }
}