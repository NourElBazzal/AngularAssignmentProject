import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { CoursesService, Course } from '../shared/courses.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.css'],
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatGridListModule, MatListModule ]
})
export class ProfessorDashboardComponent implements OnInit {
  courses: any[] = [];

  constructor(private http: HttpClient, public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const professorId = this.authService.getUserId();
    this.http.get<any[]>(`https://angularbackend-1493.onrender.com/api/professors/${professorId}/courses`)
      .subscribe({
        next: (data) => this.courses = data,
        error: (err) => console.error('Error loading professor courses:', err)
      });
  }

  goToAssignment(assignment: any): void {
    this.router.navigate(['/assignment', assignment.id, 'edit']);
  }

  onImageError(event: Event, item: any): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name || 'Course');
  }

}
