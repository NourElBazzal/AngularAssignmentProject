import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';
  
@Injectable({
  providedIn: 'root' //This makes the service available throughout the app
})

export class AssignmentsService {
  private assignments: Assignment[] = [
    { id: 1, name: 'Computer Networks Homework', dueDate: new Date('2025-03-17'), submitted: false },
    { id: 2, name: 'NLP Mini Project', dueDate: new Date('2025-03-25'), submitted: true },
    {id:3, name: 'Web Assignment', dueDate: new Date('2025-03-20'), submitted: true}
  ];

  constructor(private loggingService: LoggingService) {}

  getAssignments(): Observable<Assignment[]> {
    let assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    return of(assignments);
  }    

  getAssignment(id: number): Observable<Assignment | undefined> {
    let assignments: Assignment[] = JSON.parse(localStorage.getItem('assignments') || '[]');
    console.log("All assignments in storage:", assignments);
    const assignment = assignments.find(a => a.id === id);
    console.log("Assignment retrieved:", assignment);
    return of(assignment);
  }  

  addAssignment(assignment: Assignment): Observable<void> {
    let assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    assignments.push(assignment);
    localStorage.setItem('assignments', JSON.stringify(assignments)); 
    return of();
  }

  deleteAssignment(id: number): Observable<string> {
    let assignments: Assignment[] = JSON.parse(localStorage.getItem('assignments') || '[]');
    assignments = assignments.filter((a: Assignment) => a.id !== id); // Explicitly define 'a' as Assignment
    localStorage.setItem('assignments', JSON.stringify(assignments)); // Save changes
    return of(`Assignment deleted successfully.`);
  }

  updateAssignment(updatedAssignment: Assignment): Observable<string> {
    let assignments: Assignment[] = JSON.parse(localStorage.getItem('assignments') || '[]');
    console.log("Before update:", assignments); // Debugging log
    assignments = assignments.map((a: Assignment) => {
        if (a.id === updatedAssignment.id) {
            console.log("Updating assignment:", updatedAssignment); // 🔍 See if grade & feedback exist
            return { ...a, ...updatedAssignment }; // 🔥 Merge changes correctly
        }
        return a;
    });
    console.log("After update:", assignments); // Confirm updated data
    localStorage.setItem('assignments', JSON.stringify(assignments)); // Save changes
    return of('Assignment updated successfully.');
}

  submitAssignment(id: number, fileUrl: string): Observable<string> {
    let assignments: Assignment[] = JSON.parse(localStorage.getItem('assignments') || '[]');
    let assignment = assignments.find(a => a.id === id);
    if (assignment) {
      assignment.submitted = true;
      assignment.fileUrl = fileUrl;
      localStorage.setItem('assignments', JSON.stringify(assignments));
      return of('Assignment submitted successfully.');
    }
    return of('Assignment not found.');
  }
  
}
