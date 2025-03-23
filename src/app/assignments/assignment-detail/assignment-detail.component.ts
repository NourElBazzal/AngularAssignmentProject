import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../assignment.model'; 
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AssignmentsService } from '../../shared/assignments.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, 
    MatButtonModule, MatSlideToggleModule, MatDialogModule], 
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})

export class AssignmentDetailComponent {
  assignment?: Assignment;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentsService: AssignmentsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id']; 
    console.log("Fetching assignment with ID:", id); 
  
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (assignment) {
        this.assignment = assignment;
        console.log("Assignment found:", this.assignment); 
      } else {
        console.log("No assignment found with this ID! Redirecting...");
        this.router.navigate(['/']); 
      }
    });
  }
  
  onDelete() {
    if (!this.assignment) return;
  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { assignmentName: this.assignment.name },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assignmentsService.deleteAssignment(this.assignment?.id!).subscribe(() => {
          this.router.navigate(['/']); // Navigate back after deletion
        });
      }
    });
  }

  onToggleSubmission() {
    if (this.assignment) {
      this.assignment.submitted = !this.assignment.submitted;
      this.assignmentsService.updateAssignment(this.assignment).subscribe((message) => {
        console.log(message);
      });
    }
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignment?.id, 'edit'], {
      queryParams: { name: this.assignment?.name },
      fragment: 'editing'
    });
  }
  
}