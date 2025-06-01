import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  private apiUrl = 'http://localhost:8010/api/assignments';

  constructor(
    private http: HttpClient,
    private loggingService: LoggingService
  ) {}

  getAssignments(): Observable<Assignment[]> {
    this.loggingService.log('All Assignments', 'Fetching');
    return this.http.get<Assignment[]>(this.apiUrl);
  }

  getAssignment(id: number): Observable<Assignment | undefined> {
    this.loggingService.log(`Assignment ID: ${id}`, 'Fetching');
    return this.http.get<Assignment>(`${this.apiUrl}/${id}`);
  }

  addAssignment(assignment: Assignment): Observable<Assignment> {
    this.loggingService.log(assignment.name, 'Adding');
    return this.http.post<Assignment>(this.apiUrl, assignment);
  }

  deleteAssignment(id: number): Observable<string> {
    this.loggingService.log(`Assignment ID: ${id}`, 'Deleting');
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  updateAssignment(updatedAssignment: Assignment): Observable<string> {
    this.loggingService.log(updatedAssignment.name, 'Updating');
    return this.http.put<string>(`${this.apiUrl}/${updatedAssignment.id}`, updatedAssignment);
  }

  submitAssignment(id: number, formData: FormData): Observable<any> {
    this.loggingService.log(`Assignment ID: ${id}`, 'Submitting');
    return this.http.put(`${this.apiUrl}/${id}/submit`, formData);
  }
}