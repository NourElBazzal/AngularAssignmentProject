import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-submission-confirm-dialog',
  standalone: true,
  templateUrl: './submission-confirm-dialog.component.html',
  styleUrls: ['./submission-confirm-dialog.component.css']
})
export class SubmissionConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SubmissionConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { assignmentName: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // User confirms submission
  }

  onCancel(): void {
    this.dialogRef.close(false); // User cancels submission
  }
}
