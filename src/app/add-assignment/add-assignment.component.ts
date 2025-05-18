import { Component } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports: [
    MatFormFieldModule, MatButtonModule, FormsModule,
    MatDatepickerModule, MatInputModule, MatNativeDateModule
  ],
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent {
  assignmentName: string = '';
  dueDate: Date = new Date();
  newAssignment: Assignment = { id: 0, name: '', dueDate: new Date(), submitted: false };

  constructor(private assignmentsService: AssignmentsService, private router: Router) {}

  onSubmit() {
    this.newAssignment.name = this.assignmentName;
    this.newAssignment.dueDate = this.dueDate;
    this.newAssignment.submitted = false;

    if (!this.newAssignment.name || !this.newAssignment.dueDate) {
      console.error('Name and due date are required');
      alert('Name and due date are required');
      return;
    }

    this.assignmentsService.getAssignments().subscribe({
      next: (assignments) => {
        const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.id || 0)) : 0;
        this.newAssignment.id = maxId + 1;

        console.log('Adding assignment:', this.newAssignment);
        this.assignmentsService.addAssignment(this.newAssignment).subscribe({
          next: (response) => {
            console.log('Assignment added successfully:', response);
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error adding assignment:', err);
            if (err.status === 400 && err.error.includes('ID already exists')) {
              // Retry with a higher ID
              this.newAssignment.id += 1;
              console.log('Retrying with ID:', this.newAssignment.id);
              this.assignmentsService.addAssignment(this.newAssignment).subscribe({
                next: (response) => {
                  console.log('Assignment added on retry:', response);
                  this.router.navigate(['/']);
                },
                error: (retryErr) => {
                  console.error('Retry failed:', retryErr);
                  alert(`Failed to add assignment: ${retryErr.error || 'Unknown error'}`);
                }
              });
            } else {
              alert(`Failed to add assignment: ${err.error || 'Unknown error'}`);
            }
          }
        });
      },
      error: (err) => {
        console.error('Error fetching assignments for ID:', err);
        alert('Failed to generate assignment ID: ' + err.message);
      }
    });
  }
}