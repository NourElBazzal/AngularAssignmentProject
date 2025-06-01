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
  selector: 'app-professors-list',
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
  templateUrl: './professors-list.component.html',
  styleUrls: ['./professors-list.component.css']
})
export class ProfessorsListComponent implements OnInit {
  professors: any[] = [];
  searchText: string = '';
  showPasswords: { [id: number]: boolean } = {};
  displayedColumns = ['image', 'name', 'email', 'password', 'actions'];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchProfessors();
  }

  fetchProfessors(): void {
    this.http.get<any[]>('http://localhost:8010/api/professors').subscribe(data => {
      this.professors = data;
    });
  }

  get filteredProfessors(): any[] {
    return this.professors.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  togglePassword(professorId: number) {
    this.showPasswords[professorId] = !this.showPasswords[professorId];
  }

  editProfessor(professor: any): void {
    const dialogRef = this.dialog.open(EditDeleteDialogComponent, {
      data: { action: 'edit', member: professor, nameField: 'name' },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updated = {
          ...professor,
          name: result.name,
          password: result.password,
          image: result.image
        };
        this.http.put(`http://localhost:8010/api/professors/${professor.id}`, updated)
          .subscribe(() => this.fetchProfessors());
      }
    });
  }

  deleteProfessor(id: number): void {
    const professor = this.professors.find(p => p.id === id);
    if (!professor) return;

    const dialogRef = this.dialog.open(EditDeleteDialogComponent, {
      data: { action: 'delete', member: professor, nameField: 'name' },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://localhost:8010/api/professors/${id}`)
          .subscribe(() => this.fetchProfessors());
      }
    });
  }
}