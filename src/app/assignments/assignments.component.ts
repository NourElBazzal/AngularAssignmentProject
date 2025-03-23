import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { SubmittedDirective } from '../shared/submitted.directive';
import { NotSubmittedDirective } from '../shared/not-submitted.directive';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckbox} from '@angular/material/checkbox';
import {Assignment} from './assignment.model';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component'; 
import {AssignmentsService} from '../shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assignments',
  imports: [CommonModule, SubmittedDirective, NotSubmittedDirective, FormsModule, 
    MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, 
    MatFormFieldModule, MatCheckbox, MatToolbarModule, MatListModule, MatTableModule, 
    AssignmentDetailComponent, RouterModule],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.css'
})

export class AssignmentsComponent implements OnInit{
  ajoutActive= false;
  assignmentName:string="";
  dueDate:Date | null = new Date();
  formVisible = false;
  assignment?: Assignment;

  assignments: Assignment[] = [];
  assignmentClicked: Assignment | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentsService: AssignmentsService
  ) {}

  ngOnInit(): void {
    this.getAssignments();

    setTimeout(() =>{
      this.ajoutActive = true;
    }, 2000);
  }

  getAssignments(): void {
    this.assignmentsService.getAssignments().subscribe((data) => {
      this.assignments = [...data];
    });
  }

  onAddAssignmentBtnClick(): void {
    this.assignmentClicked = null;  // Hide selected assignment
    this.formVisible = true; // Show add form
  }

  onAssignmentAdded(newAssignment: Assignment): void {
    this.assignmentsService.addAssignment(newAssignment).subscribe(() => {
      this.getAssignments(); // Ensure list refreshes
      this.formVisible = false;
    });
  }

  onAssignmentDeleted(id: number): void {
    this.assignmentsService.deleteAssignment(id).subscribe((message) => {
      console.log(message);
      this.getAssignments(); // Refresh list
    });
  }

  onAssignmentClick(assignment: Assignment) {
    console.log("Navigating to assignment details:", assignment.id); 
    this.router.navigate(['/assignment', assignment.id]);
  }
  
  toggleSubmission() {
    if (this.assignment) {
      this.assignment.submitted = !this.assignment.submitted;
      this.assignmentsService.updateAssignment(this.assignment).subscribe((message) => {
        console.log(message);
      });
    }
  }
    
}

