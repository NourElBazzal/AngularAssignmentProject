import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule, 
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username = '';
  password = '';
  isError = false;

  constructor(private authService: AuthService, private router: Router) {} 

  onLogin() {
    if (this.authService.login(this.username, this.password)) { 
      this.router.navigate(['/']);
    } else {
      this.isError = true;
    }
  }
}