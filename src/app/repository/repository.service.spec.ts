import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RepositoryService } from './repository.service';
import { Repository } from './repository';
import { environment } from '../../environments/environment';
import { faker } from '@faker-js/faker';

function createMockRepository(overrides: Partial<Repository> = {}): Repository {
  return {
    id: faker.number.int({ min: 100, max: 999 }),
    name: `repo-${faker.word.noun()}`,
    description: faker.lorem.sentence(),
    language: faker.helpers.arrayElement(['TypeScript', 'JavaScript', 'Python', 'Java', 'Go']),
    stars: faker.number.int({ min: 0, max: 500 }),
    createdAt: faker.date.past().toISOString().split('T')[0],
    ownerId: faker.number.int({ min: 1, max: 30 }),
    ...overrides
  };
}

describe('RepositoryService', () => {
  let service: RepositoryService;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.apiBaseUrl}/repositories.json`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepositoryService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(RepositoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /repositories.json on the correct URL', () => {
    service.getRepositories().subscribe();
    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should return an array of repositories', () => {
    const mockRepos = [createMockRepository(), createMockRepository()];
    let result: Repository[] = [];
    service.getRepositories().subscribe(data => (result = data));
    httpMock.expectOne(API_URL).flush(mockRepos);
    expect(result.length).toBe(mockRepos.length);
    expect(result[0].name).toBe(mockRepos[0].name);
    expect(result[1].language).toBe(mockRepos[1].language);
  });

  it('should return empty array when API returns no repos', () => {
    let result: Repository[] = [];
    service.getRepositories().subscribe(data => (result = data));
    httpMock.expectOne(API_URL).flush([]);
    expect(result.length).toBe(0);
  });

  it('should find a repository by id', () => {
    const target = createMockRepository({ id: 999 });
    const mockRepos = [createMockRepository(), target, createMockRepository()];
    let result: Repository | undefined;
    service.getRepository(999).subscribe(data => (result = data));
    httpMock.expectOne(API_URL).flush(mockRepos);
    expect(result).toBeTruthy();
    expect(result?.id).toBe(999);
    expect(result?.name).toBe(target.name);
  });

  it('should return undefined when repository id does not exist', () => {
    let result: Repository | undefined = {} as Repository;
    service.getRepository(99999).subscribe(data => (result = data));
    httpMock.expectOne(API_URL).flush([createMockRepository(), createMockRepository()]);
    expect(result).toBeUndefined();
  });

  it('should cache response with shareReplay', () => {
    const mockRepos = [createMockRepository()];
    service.getRepositories().subscribe();
    service.getRepositories().subscribe();
    // shareReplay(1) → solo una petición HTTP
    const req = httpMock.expectOne(API_URL);
    req.flush(mockRepos);
  });

  it('should propagate HTTP errors on getRepositories', () => {
    let hasError = false;
    service.getRepositories().subscribe({ error: () => (hasError = true) });
    httpMock.expectOne(API_URL)
      .flush('Not Found', { status: 404, statusText: 'Not Found' });
    expect(hasError).toBeTruthy();
  });
});