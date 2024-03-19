import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalDB } from '../common/db/local-db';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiURL = `${environment.apiURL}/user`;

  public getUsers() {
    return this.http.get<User[]>(`${this.apiURL}`).pipe(
      switchMap(users => {
        const userImageRequests = users.map(
          user => this.getUserImage(user.id).pipe(
            catchError(() => of(null)),
            map(image => ({ user, image}))
        ));
        return forkJoin(userImageRequests);
      }),
      tap(users => {
        new LocalDB().addUsers(users.map(user => ({
          id: user.user.id,
          name: user.user.name,
          initials: user.user.initials,
          imageBlob: user.image
        })));
      }),
      map(users => users.map(user => ({
        user: user.user,
        image: user.image && URL.createObjectURL(user.image)
      })))
    );
  }

  private getUserImage(userId: string) {
    return this.http.get(`${this.apiURL}/image/${userId}`, { responseType: 'blob' });
  }

  public addUpdateUserImage(userId: string, image: ArrayBuffer) {
    const blob = new Blob([image]);
    const formData = new FormData();
    formData.append('image', blob);

    return this.http.put(`${this.apiURL}/image/${userId}`, formData);
  }
}
