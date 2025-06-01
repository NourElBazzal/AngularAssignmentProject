import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; // Add MatDialogModule
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; // Add CommonModule for NgIf

@Component({
  selector: 'app-edit-delete-dialog',
  standalone: true,
  imports: [
    CommonModule, // Add for NgIf
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule // Add for mat-dialog-content and mat-dialog-actions
  ],
  templateUrl: './edit-delete-dialog.component.html',
  styleUrls: ['./edit-delete-dialog.component.css']
})
export class EditDeleteDialogComponent {
  action: 'edit' | 'delete';
  member: any;
  nameField: string;
  updatedData: { name: string; password: string; image: string };

  constructor(
    public dialogRef: MatDialogRef<EditDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: 'edit' | 'delete', member: any, nameField: string }
  ) {
    this.action = data.action;
    this.member = data.member;
    this.nameField = data.nameField;
    this.updatedData = {
      name: this.member[this.nameField],
      password: this.member.password,
      image: this.member.image || ''
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.action === 'edit') {
      this.dialogRef.close(this.updatedData);
    } else {
      this.dialogRef.close(true);
    }
  }
}