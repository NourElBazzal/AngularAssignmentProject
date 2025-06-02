import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  imports: [
    FormsModule, MatFormFieldModule, MatButtonModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule
  ],
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {
  assignment: Assignment = { _id: '', id: 0, name: '', dueDate: new Date(), submitted: false };
  originalSubmitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentsService: AssignmentsService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Fetching assignment with ID:', id);
    this.assignmentsService.getAssignment(id).subscribe({
      next: (assignment) => {
        if (assignment) {
          console.log('Fetched assignment:', assignment);
          this.assignment = {
            _id: assignment._id || '',
            id: assignment.id || 0,
            name: assignment.name || 'Untitled',
            dueDate: assignment.dueDate ? new Date(assignment.dueDate) : new Date(),
            submitted: assignment.submitted || false,
            fileUrl: assignment.fileUrl,
            grade: assignment.grade,
            feedback: assignment.feedback
          };
          this.originalSubmitted = assignment.submitted;
        } else {
          console.log('Assignment not found');
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Error fetching assignment:', err);
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    console.log('Submitting assignment:', this.assignment);
    if (!this.assignment.name || !this.assignment.dueDate) {
      console.error('Name and due date are required');
      return;
    }
    this.assignmentsService.updateAssignment(this.assignment).subscribe({
      next: (response) => {
        console.log('Assignment updated successfully:', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error updating assignment:', err);
      }
    });
  }
}