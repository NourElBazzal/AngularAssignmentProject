import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, of } from 'rxjs';
  
@Injectable({
  providedIn: 'root' //This makes the service available throughout the app
})

export class AssignmentsService {
  private assignments: Assignment[] = [
    { id: 1, name: 'Computer Networks Homework', dueDate: new Date('2025-03-17'), submitted: false },
    { id: 2, name: 'NLP Mini Project', dueDate: new Date('2025-03-25'), submitted: true },
    {id:3, name: 'Web Assignment', dueDate: new Date('2025-03-20'), submitted: true}
  ];

  constructor() {}

  getAssignments(): Observable<Assignment[]> {
    return of(this.assignments);
  }

  addAssignment(assignment: Assignment): Observable<string> {
    this.assignments.push(assignment);
    return of('Assignment successfully added!');
  }  

  deleteAssignment(id: number): Observable<string> {
    this.assignments = this.assignments.filter(a => a.id !== id);
    return of('Assignment deleted successfully.');
  }

  updateAssignment(assignment: Assignment): Observable<string> {
    // Send a PUT request if connected to a real API
    // return this.http.put(`${this.apiUrl}/${assignment.id}`, assignment);
  
    // Since we are working with a local array, just return a success message
    return of("Assignment service: assignment updated.");
  }
  
}
