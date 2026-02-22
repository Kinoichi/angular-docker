/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  // Load the JSON file from assets
  loadConfig() {
    return firstValueFrom(this.http.get('config.json')).then((data) => (this.config = data));
  }

  get apiUrl() {
    return this.config?.API_URL;
  }
}
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: Record<string, string> = {};
  private http = inject(HttpClient);

  async loadConfig(): Promise<void> {
    this.config = await firstValueFrom(
      this.http.get<Record<string, string>>('/config/config.json'),
    );
  }

  get(key: string): string {
    return this.config[key];
  }
}
