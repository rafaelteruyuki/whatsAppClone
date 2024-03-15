import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  public getUsers() {
    return this.http.get<User[]>(`${environment.apiURL}/users`)
      .pipe(
        catchError(error => {
          console.error('Error!', error);
          return of([]);
        }
      )
    );
  }
}
