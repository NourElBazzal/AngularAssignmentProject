import { Component, EventEmitter, Output } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';


@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports:[MatFormFieldModule,MatButtonModule, FormsModule, MatDatepickerModule, MatInputModule],
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})

export class AddAssignmentComponent {
  @Output() assignmentAdded = new EventEmitter<Assignment>(); // Custom Event

  assignmentName = "";
  dueDate: Date | null = null;

  onSubmit() {
    if (!this.assignmentName || !this.dueDate) return;

    const newAssignment: Assignment = {
      id: Date.now(),  // Generate a unique ID based on timestamp
      name: this.assignmentName,
      dueDate: this.dueDate,
      submitted: false,
    };

    this.assignmentAdded.emit(newAssignment); // Emit event to parent
    this.assignmentName = "";
    this.dueDate = null;
  }
}
