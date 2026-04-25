import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, shareReplay } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl + '/users.json'

    private users$ = this.http.get<User[]>(this.apiUrl).pipe(shareReplay(1));
  getUsers(): Observable<User[]> {
    return this.users$;
  }

}
