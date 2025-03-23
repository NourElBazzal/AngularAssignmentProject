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
  assignment: Assignment = { id: 0, name: '', dueDate: new Date(), submitted: false };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentsService: AssignmentsService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (assignment) this.assignment = assignment;
    });

    // Récupérer les queryParams et fragments
    this.route.queryParams.subscribe(params => {
      console.log("Query Params:", params);
    });

    this.route.fragment.subscribe(fragment => {
      console.log("Fragment:", fragment);
    });
  }

  onSubmit() {
    this.assignmentsService.updateAssignment(this.assignment).subscribe(() => {
      this.router.navigate(['/assignment', this.assignment.id]);
    });
  }
}
