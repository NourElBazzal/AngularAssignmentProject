import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../assignment.model'; 
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AssignmentsService } from '../../shared/assignments.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { SubmissionConfirmDialogComponent } from './submission-confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { ConfirmGradeDialogComponent } from './confirm-grade-dialog.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, 
    MatButtonModule, MatFormFieldModule, MatSlideToggleModule,
     MatDialogModule, FormsModule, MatInputModule], 
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})

export class AssignmentDetailComponent {
  assignment?: Assignment;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentsService: AssignmentsService,
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAssignment();
  
    // Listen for route param changes to refresh data
    this.route.params.subscribe(params => {
      const newId = +params['id'];
      if (newId !== this.assignment?.id) {
        this.assignmentsService.getAssignment(newId).subscribe((assignment) => {
          if (assignment) this.assignment = assignment;
        });
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmitAssignment() {
    if (!this.assignment || !this.selectedFile) return; 
  
    const dialogRef = this.dialog.open(SubmissionConfirmDialogComponent, {
      width: '350px',
      data: { assignmentName: this.assignment.name }
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.assignment && this.selectedFile) { 
        const fileUrl = URL.createObjectURL(this.selectedFile as Blob); 
        this.assignmentsService.submitAssignment(this.assignment.id, fileUrl).subscribe(() => {
          if (this.assignment) {
            this.assignment.submitted = true;
            this.assignment.fileUrl = fileUrl;
          }
          console.log('Assignment submitted successfully.');
        });
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
    if (!this.assignment) return; 

    this.router.navigate(['/assignment', this.assignment?.id, 'edit'], {
      queryParams: { name: this.assignment?.name },
      fragment: 'editing'
    });
  }

  canSubmit(): boolean {
    return this.authService.isStudent() && !this.assignment?.submitted;
  }

  onSubmitGrade() {
    if (!this.assignment) return; 

    const dialogRef = this.dialog.open(ConfirmGradeDialogComponent, {
      width: '400px',
      data: { 
        grade: this.assignment.grade ?? 0,
        feedback: this.assignment.feedback ?? ''
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.assignment) {
        console.log("Dialog result:", result); // Debugging

        this.assignment.grade = result.grade;  
        this.assignment.feedback = result.feedback;

        this.assignmentsService.updateAssignment(this.assignment).subscribe(() => {
          console.log("Grade & feedback updated successfully:", this.assignment);
        });
      }
    });
  }

  loadAssignment() {
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



}