import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, shareReplay } from 'rxjs';
import { Repository } from './repository';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl + '/repositories.json';

  private repos$ = this.http.get<Repository[]>(this.apiUrl).pipe(shareReplay(1));

  getRepositories(): Observable<Repository[]> {
    return this.repos$;
  }

  getRepository(id: number): Observable<Repository | undefined> {
    return this.repos$.pipe(
      map(repos => repos.find(r => r.id === id))
    );
  }
}
