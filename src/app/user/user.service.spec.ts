import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { User } from './user';
import { faker } from '@faker-js/faker';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.number.int({ min: 1, max: 999 }),
    username: faker.internet.username(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatarUrl: faker.image.avatar(),
    role: faker.helpers.arrayElement(['admin', 'developer', 'designer']),
    location: faker.location.city(),
    repoIds: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () =>
      faker.number.int({ min: 100, max: 999 }),
    ),
    ...overrides
  };
}
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/users.json`;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET on the correct URL', () => {
    service.getUsers().subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should return an array of users', () => {
    const mockUsers = [createMockUser(), createMockUser(), createMockUser()];
    let result: User[] = [];
    service.getUsers().subscribe(data => (result = data));
    httpMock.expectOne(apiUrl).flush(mockUsers);
    expect(result.length).toBe(mockUsers.length);
    expect(result[0].name).toBe(mockUsers[0].name);
    expect(result[0].email).toBe(mockUsers[0].email);
  });
  it('should return empty array when API returns no users', () => {
    let result: User[] = [];
    service.getUsers().subscribe(data => (result = data));
    httpMock.expectOne(apiUrl).flush([]);
    expect(result.length).toBe(0);
  });

  it('should cache the response with shareReplay', () => {
    const mockUsers = [createMockUser()];
    service.getUsers().subscribe();
    service.getUsers().subscribe();
    // Solo debe haber UNA petición HTTP por el shareReplay(1)
    const req = httpMock.expectOne(apiUrl);
    req.flush(mockUsers);
  });

  it('should propagate HTTP errors', () => {
    let hasError = false;
    service.getUsers().subscribe({ error: () => (hasError = true) });
    const req = httpMock.expectOne(apiUrl);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    expect(hasError).toBeTruthy();
  });
});
