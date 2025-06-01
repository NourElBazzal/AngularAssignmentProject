import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'; // Add AfterViewInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit { // Add AfterViewInit
  userName: string = '';
  userImage: string = '';
  newPassword: string = '';
  errorMessage: string | null = null;
  selectedImage: File | null = null;
  showPassword: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // Reference to the file input

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName() || '';
    this.userImage = this.authService.getUserImage() || 'https://ui-avatars.com/api/?name=User';
  }

  ngAfterViewInit(): void {
    // Ensure fileInput is available after view initialization
    if (!this.fileInput) {
      console.error('fileInput not found in the template');
    }
  }

  onSave(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'User ID not found';
      return;
    }

    const formData = new FormData();
    if (this.userName.trim()) formData.append('name', this.userName);
    if (this.newPassword.trim()) formData.append('password', this.newPassword);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
      console.log('Uploading image:', this.selectedImage.name);
    }
    formData.append('role', this.authService.getRole() || '');

    this.authService.updateProfile(userId, this.userName, this.newPassword, this.selectedImage).subscribe({
      next: (response) => {
        if (response.error) {
          this.errorMessage = response.error;
        } else {
          this.errorMessage = null;
          this.userImage = this.authService.getUserImage() || this.userImage;
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to update profile';
        console.error('Update error:', err);
      }
    });
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userImage = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  triggerFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click(); // Trigger the hidden file input
    } else {
      console.error('fileInput is not available');
    }
  }
}