import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-grade-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatDialogModule], 
  template: `
    <h2 mat-dialog-title>💯 Submit Grade & Feedback</h2>
    <mat-dialog-content>
        <mat-form-field appearance="fill">
            <mat-label>Grade (out of 20)</mat-label>
            <input matInput type="number" [(ngModel)]="data.grade" min="0" max="20">
        </mat-form-field>

        <mat-form-field appearance="fill">
            <mat-label>Feedback</mat-label>
            <textarea matInput rows="3" [(ngModel)]="data.feedback"></textarea>
        </mat-form-field>
    </mat-dialog-content>
    
    <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onConfirm()">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmGradeDialogComponent {
    constructor(
      public dialogRef: MatDialogRef<ConfirmGradeDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { grade: number, feedback: string }
    ) {}

    onCancel(): void {
      this.dialogRef.close(null);
    }

    onConfirm(): void {
      this.dialogRef.close(this.data);
    }
}
