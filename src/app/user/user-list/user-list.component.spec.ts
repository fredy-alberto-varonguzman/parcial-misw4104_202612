/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { User } from '../user';
import { faker } from '@faker-js/faker';
import { UserService } from '../user.service';
import { Mocked } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.number.int({ min: 1, max: 999 }),
    username: faker.internet.username(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatarUrl: faker.image.avatar(),
    role: faker.helpers.arrayElement(['admin', 'developer', 'designer']),
    location: faker.location.city(),
    repoIds: [faker.number.int(), faker.number.int()],
    ...overrides
  };
}
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let serviceSpy: Mocked<UserService>;
  let mockUsers: User[];

  beforeEach(async () => {
    mockUsers = Array.from({ length: 8 }, () => createMockUser());
    serviceSpy = {
      getUsers: vi.fn().mockReturnValue(of(mockUsers))
    } as unknown as Mocked<UserService>;

    // ↓ cambio 2: await + imports en lugar de declarations
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: serviceSpy },
        provideRouter([])
      ]
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
  it('should create', () => {
    createComponent()
    expect(component).toBeTruthy();
  });

  it('should call getUsers on init', () => {
    createComponent();
    expect(serviceSpy.getUsers).toHaveBeenCalledTimes(1);
  });
});
