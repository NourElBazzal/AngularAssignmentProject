import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit {
  students: any[] = [];
  searchText: string = '';
  showPasswords: { [id: number]: boolean } = {}; // tracks password toggle state

  displayedColumns = ['image', 'fullName', 'email', 'password', 'actions'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.http.get<any[]>('http://localhost:8010/api/students').subscribe(data => {
      this.students = data;
    });
  }

  get filteredStudents(): any[] {
    return this.students.filter(s =>
      s.fullName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  togglePassword(studentId: number) {
    this.showPasswords[studentId] = !this.showPasswords[studentId];
  }

  editStudent(student: any): void {
    const newName = prompt('Edit full name:', student.fullName);
    if (!newName) return;

    const newPassword = prompt('Edit password:', student.password);
    if (!newPassword) return;

    const newImage = prompt('Edit image URL:', student.image || '');
    if (newImage === null) return;

    const updatedStudent = {
      ...student,
      fullName: newName,
      password: newPassword,
      image: newImage
    };

    this.http.put(`http://localhost:8010/api/students/${student.id}`, updatedStudent)
      .subscribe(() => this.fetchStudents());
  }


  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.http.delete(`http://localhost:8010/api/students/${id}`)
        .subscribe(() => this.fetchStudents());
    }
  }
}
