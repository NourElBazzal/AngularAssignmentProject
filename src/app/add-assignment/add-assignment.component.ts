import { Component, EventEmitter, Output } from '@angular/core';
import {Assignment} from '../assignments/assignment.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {AssignmentsService} from '../shared/assignments.service';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports:[MatFormFieldModule,MatButtonModule, 
    FormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})

export class AddAssignmentComponent {
  assignmentName: string = '';
  dueDate: Date = new Date();
  newAssignment: Assignment = { id: 0, name: '', dueDate: new Date(), submitted: false };

  constructor(private assignmentsService: AssignmentsService, private router: Router) {}

  onSubmit() {
    // Retrieve last used ID or start at 0
    let lastId = parseInt(localStorage.getItem('lastAssignmentId') || '0', 10);
    
    // Increment ID for the new assignment
    this.newAssignment.id = ++lastId; 
    this.newAssignment.name = this.assignmentName;
    this.newAssignment.dueDate = this.dueDate;
    this.newAssignment.submitted = false;
  
    // Get current assignments list
    let assignments: Assignment[] = JSON.parse(localStorage.getItem('assignments') || '[]');
    assignments.push(this.newAssignment);
  
    // Save updated assignments and last used ID
    localStorage.setItem('assignments', JSON.stringify(assignments));
    localStorage.setItem('lastAssignmentId', lastId.toString());
  
    console.log("Assignment added:", this.newAssignment);
  
    // Redirect to the assignment list
    setTimeout(() => {
      this.router.navigate(['/']); // Navigate back to the list
    }, 100);
  }   
  
}
