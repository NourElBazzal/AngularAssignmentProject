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
    MatButtonModule
  ],
  templateUrl: './professors-list.component.html',
  styleUrls: ['./professors-list.component.css']
})
export class ProfessorsListComponent implements OnInit {
  professors: any[] = [];
  searchText: string = '';
  showPasswords: { [id: number]: boolean } = {};
  displayedColumns = ['image', 'name', 'email', 'password', 'actions'];

  constructor(private http: HttpClient) {}

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
    const newName = prompt('Edit full name:', professor.name);
    if (!newName) return;

    const newPassword = prompt('Edit password:', professor.password);
    if (!newPassword) return;

    const newImage = prompt('Edit image URL:', professor.image || '');
    if (newImage === null) return;

    const updated = {
      ...professor,
      name: newName,
      password: newPassword,
      image: newImage
    };

    this.http.put(`http://localhost:8010/api/professors/${professor.id}`, updated)
      .subscribe(() => this.fetchProfessors());
  }

  deleteProfessor(id: number): void {
    if (confirm('Are you sure you want to delete this professor?')) {
      this.http.delete(`http://localhost:8010/api/professors/${id}`)
        .subscribe(() => this.fetchProfessors());
    }
  }

  onImageError(professor: any, event: Event): void {
    professor.image = '';
    const target = event.target as HTMLImageElement;
    target.src = 'https://ui-avatars.com/api/?name=' + professor.name;
  }

}
