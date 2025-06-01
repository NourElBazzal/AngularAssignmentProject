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
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Add MatDialog
import { EditDeleteDialogComponent } from '../edit-delete-dialog/edit-delete-dialog.component'; // Import dialog component

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
    MatButtonModule,
    MatDialogModule // Add MatDialogModule
  ],
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class StudentsListComponent implements OnInit {
  students: any[] = [];
  searchText: string = '';
  showPasswords: { [id: number]: boolean } = {};

  displayedColumns = ['image', 'fullName', 'email', 'password', 'actions'];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

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
    const dialogRef = this.dialog.open(EditDeleteDialogComponent, {
      data: { action: 'edit', member: student, nameField: 'fullName' },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedStudent = {
          ...student,
          fullName: result.name,
          password: result.password,
          image: result.image
        };
        this.http.put(`http://localhost:8010/api/students/${student.id}`, updatedStudent)
          .subscribe(() => this.fetchStudents());
      }
    });
  }

  deleteStudent(id: number): void {
    const student = this.students.find(s => s.id === id);
    if (!student) return;

    const dialogRef = this.dialog.open(EditDeleteDialogComponent, {
      data: { action: 'delete', member: student, nameField: 'fullName' },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://localhost:8010/api/students/${id}`)
          .subscribe(() => this.fetchStudents());
      }
    });
  }
}