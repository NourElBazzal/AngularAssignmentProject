import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { CoursesService, Course } from '../shared/courses.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatListModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isStudent()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadCourses();
  }

  loadCourses() {
    this.coursesService.getStudentCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('Loaded courses:', courses); // Debug
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.courses = [];
      }
    });
  }

  onImageError(event: Event, item: any) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/150'; // Fallback image
    if (item.name) {
      item.image = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name);
    }
  }
  goToAssignment(assignment: any): void {
    this.router.navigate(['/assignment', assignment.id]);
  }

}