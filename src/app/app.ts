import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('frontend-angular');
  http = inject(HttpClient);

  apiUrl = environment.API_URL;
  apiUrlFromConfig = inject(ConfigService).get('API_URL');

  ngOnInit(): void {
    console.log('App component initialized with title:', this.title());
    this.http.get('http://localhost:3000/api/test').subscribe({
      next: (response) => {
        console.log('Response from backend:', response);
      },
      error: (error) => {
        console.error('Error fetching data from backend:', error);
      },
    });

    this.http.get('http://localhost:3000/api/db-test').subscribe({
      next: (response) => {
        console.log('Response from backend:', response);
      },
      error: (error) => {
        console.error('Error fetching data from backend:', error);
      },
    });

    this.http.get('http://localhost:3000/api/users').subscribe({
      next: (response) => {
        console.log('Response from backend:', response);
      },
      error: (error) => {
        console.error('Error fetching data from backend:', error);
      },
    });
  }
}
