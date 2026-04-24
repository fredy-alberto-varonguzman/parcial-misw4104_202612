import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Repository } from './repository';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl + '/repositories.json';

  getRepositories(): Observable<Repository[]> {
    return this.http.get<Repository[]>(this.apiUrl)
  }

  getRepository(id: number): Observable<Repository| undefined> {
    return this.http.get<Repository[]>(this.apiUrl).pipe(
      map(repos => repos.find(r => r.id === id))
    );
  }
}
