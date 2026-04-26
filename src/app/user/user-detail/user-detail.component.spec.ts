import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { User } from '../user';
import { faker } from '@faker-js/faker';

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.number.int({ min: 1, max: 999 }),
    username: faker.internet.username(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatarUrl: faker.image.avatar(),
    role: faker.helpers.arrayElement(['admin', 'developer', 'designer']),
    location: faker.location.city(),
    repoIds: [faker.number.int(), faker.number.int(), faker.number.int()],
    ...overrides,
  };
}

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockUser: User;

  beforeEach(async () => {
    mockUser = createMockUser();

    await TestBed.configureTestingModule({
      imports: [UserDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    const name = fixture.nativeElement.querySelector('.detail-name');
    expect(name.textContent?.trim()).toBe(mockUser.name);
  });

  it('should display @username and role in subtitle', () => {
    const sub = fixture.nativeElement.querySelector('.detail-sub');
    expect(sub.textContent).toContain(`@${mockUser.username}`);
    expect(sub.textContent).toContain(mockUser.role);
  });

  it('should display email', () => {
    expect(fixture.nativeElement.textContent).toContain(mockUser.email);
  });

  it('should display location', () => {
    expect(fixture.nativeElement.textContent).toContain(mockUser.location);
  });

  it('should display role badge', () => {
    const badge = fixture.nativeElement.querySelector('.role-badge');
    expect(badge.textContent?.trim()).toBe(mockUser.role);
  });

  it('should display repositories count', () => {
    expect(fixture.nativeElement.textContent).toContain(mockUser.repoIds.length.toString());
  });

  it('should display avatar with correct src', () => {
    const img = fixture.nativeElement.querySelector('.detail-avatar') as HTMLImageElement;
    expect(img.src).toContain(mockUser.avatarUrl);
  });

  it('should show "User Details" in header', () => {
    const header = fixture.nativeElement.querySelector('.detail-header');
    expect(header.textContent).toContain('User Details');
  });

  it('should update when @Input user changes', () => {
    const newUser = createMockUser();
    
    fixture.componentRef.setInput('user', newUser);
    fixture.detectChanges();
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('.detail-name');
    expect(name.textContent?.trim()).toBe(newUser.name);
  });
});
