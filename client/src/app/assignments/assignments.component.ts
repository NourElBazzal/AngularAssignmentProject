import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmittedDirective } from '../shared/submitted.directive';
import { NotSubmittedDirective } from '../shared/not-submitted.directive';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { Assignment } from './assignment.model';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AssignmentsService } from '../shared/assignments.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    CommonModule, SubmittedDirective, NotSubmittedDirective, FormsModule,
    MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatFormFieldModule, MatCheckbox, MatToolbarModule, MatListModule, MatTableModule,
    AssignmentDetailComponent, RouterModule, MatSelectModule, MatIconModule
  ],
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  ajoutActive = false;
  assignmentName: string = "";
  dueDate: Date | null = new Date();
  formVisible = false;
  assignment?: Assignment;
  assignments: Assignment[] = [];
  assignmentClicked: Assignment | null = null;
  searchText: string = '';
  filterStatus: string = '';
  sortOrder: string = 'asc';
  filteredAssignments: Assignment[] = [];
  itemsPerPage = 10;
  pageSizeOptions = [10, 15, 20];
  currentPage = 1;
  paginatedAssignments: Assignment[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentsService: AssignmentsService,
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getAssignments();
    setTimeout(() => {
      this.ajoutActive = true;
    }, 2000);
  }

  getAssignments(): void {
    const userId = this.authService.getUserId();
    const role = this.authService.getRole();

    if (role === 'admin') {
      this.assignmentsService.getAssignments().subscribe({
        next: (data) => {
          this.assignments = [...data];
          this.applyFilters();
        },
        error: (err) => console.error('Error fetching all assignments:', err)
      });
    } else if (role === 'professor') {
      this.http.get<any[]>(`http://localhost:8010/api/professors/${userId}/courses`).subscribe({
        next: (data) => {
          const allAssignments = data.flatMap(course => course.assignments || []);
          this.assignments = allAssignments.map(item => ({
            ...item,
            dueDate: new Date(item.dueDate) // Ensure dueDate is a Date object
          }));
          this.applyFilters();
        },
        error: (err) => console.error('Error fetching professor courses:', err)
      });
    } else if (role === 'student') {
      this.http.get<any[]>(`http://localhost:8010/api/students/${userId}/courses`).subscribe({ // Changed from /assignments to /courses
        next: (data) => {
          const allAssignments = data.flatMap(course => course.assignments || []);
          this.assignments = allAssignments.map(item => ({
            ...item,
            dueDate: new Date(item.dueDate) // Ensure dueDate is a Date object
          }));
          this.applyFilters();
        },
        error: (err) => console.error('Error fetching student courses:', err)
      });
    }
  }

  applyFilters() {
    let filtered = this.assignments;

    if (this.searchText) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.filterStatus === 'submitted') {
      filtered = filtered.filter(a => a.submitted);
    } else if (this.filterStatus === 'pending') {
      filtered = filtered.filter(a => !a.submitted);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    this.filteredAssignments = filtered;
    this.currentPage = 1;
    this.updatePaginatedAssignments();
  }

  updatePaginatedAssignments() {
    const start = this.startItemIndex;
    const end = this.endItemIndex;
    this.paginatedAssignments = this.filteredAssignments.slice(start, end);
  }

  onPaginationChange() {
    this.currentPage = 1;
    this.updatePaginatedAssignments();
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.updatePaginatedAssignments();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAssignments();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedAssignments();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePaginatedAssignments();
  }

  onAddAssignmentBtnClick(): void {
    this.assignmentClicked = null;
    this.formVisible = true;
  }

  onAssignmentAdded(newAssignment: Assignment): void {
    this.assignmentsService.addAssignment(newAssignment).subscribe({
      next: () => {
        this.getAssignments();
        this.formVisible = false;
      },
      error: (err) => console.error('Error adding assignment:', err)
    });
  }

  onAssignmentDeleted(id: number): void {
    this.assignmentsService.deleteAssignment(id).subscribe({
      next: (message) => {
        console.log(message);
        this.getAssignments();
      },
      error: (err) => console.error('Error deleting assignment:', err)
    });
  }

  onAssignmentClick(assignment: Assignment) {
    console.log("Navigating to assignment details:", assignment.id);
    this.router.navigate(['/assignment', assignment.id]);
  }

  toggleSubmission() {
    if (this.assignment) {
      this.assignmentsService.getAssignment(this.assignment.id).subscribe({
        next: (fullAssignment) => {
          if (fullAssignment) {
            fullAssignment.submitted = !fullAssignment.submitted;
            console.log('Updating assignment:', fullAssignment);
            this.assignmentsService.updateAssignment(fullAssignment).subscribe({
              next: (response) => {
                console.log('Submission toggled:', response);
                this.assignment = fullAssignment;
                this.getAssignments();
              },
              error: (err) => console.error('Error updating submission:', err)
            });
          }
        },
        error: (err) => console.error('Error fetching assignment:', err)
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAssignments.length / this.itemsPerPage);
  }

  get startItemIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endItemIndex(): number {
    const end = this.startItemIndex + this.itemsPerPage;
    return end > this.filteredAssignments.length ? this.filteredAssignments.length : end;
  }
}