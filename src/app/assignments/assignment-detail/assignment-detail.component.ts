import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../assignment.model'; 
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AssignmentsService } from '../../shared/assignments.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, 
    MatButtonModule, MatSlideToggleModule, MatDialogModule], 
  templateUrl: './assignment-detail.component.html',
  styleUrl: './assignment-detail.component.css'
})
export class AssignmentDetailComponent {
  @Input() assignment!: Assignment;
  @Output() assignmentDeleted = new EventEmitter<number>();

  constructor(private assignmentsService: AssignmentsService, private dialog: MatDialog) {} // ✅ Inject MatDialog correctly

  onToggleRendu() {
    if (this.assignment) {
      this.assignment.submitted = !this.assignment.submitted; // Toggle status
      this.assignmentsService.updateAssignment(this.assignment).subscribe((message) => {
        console.log(message); // Debugging
      });
    }
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { assignmentName: this.assignment.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignmentDeleted.emit(this.assignment.id);
      }
    });
  }

  onToggleSubmission() {
    if (this.assignment) {
      this.assignment.submitted = !this.assignment.submitted;
      this.assignmentsService.updateAssignment(this.assignment).subscribe((message) => {
        console.log(message); // Debugging log
      });
    }
  }
}
