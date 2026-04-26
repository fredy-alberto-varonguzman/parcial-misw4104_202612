import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryListComponent } from './repository-list.component';
import { Repository } from '../repository';
import { faker } from '@faker-js/faker';
import { RepositoryService } from '../repository.service';
import type { Mocked } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

function createMockRepository(overrides: Partial<Repository> = {}): Repository {
  return {
    id: faker.number.int({ min: 100, max: 999 }),
    name: `repo-${faker.word.noun()}`,
    description: faker.lorem.sentence(),
    language: faker.helpers.arrayElement(['TypeScript', 'JavaScript', 'Python', 'Java', 'Go']),
    stars: faker.number.int({ min: 0, max: 500 }),
    createdAt: faker.date.past().toISOString().split('T')[0],
    ownerId: faker.number.int({ min: 1, max: 30 }),
    ...overrides,
  };
}

describe('RepositoryListComponent', () => {
  let component: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;
  let serviceSpy: Mocked<RepositoryService>;
  let mockRepos: Repository[];

  beforeEach(async () => {
    mockRepos = Array.from({ length: 10 }, () => createMockRepository());

    serviceSpy = {
      getRepositories: vi.fn().mockReturnValue(of(mockRepos)),
    } as unknown as Mocked<RepositoryService>;

    await TestBed.configureTestingModule({
      imports: [RepositoryListComponent],
      providers: [{ provide: RepositoryService, useValue: serviceSpy }, provideRouter([])],
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(RepositoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should call getRepositories on init', () => {
    createComponent();
    expect(serviceSpy.getRepositories).toHaveBeenCalledTimes(1);
  });

  it('should show loading before data loads', () => {
    fixture = TestBed.createComponent(RepositoryListComponent);
    component = fixture.componentInstance;
    expect(component.loading).toBe(true);
  });

  it('should hide spinner after data loads', () => {
    createComponent();
    expect(component.loading).toBe(false);
    expect(fixture.nativeElement.querySelector('.spinner')).toBeNull();
  });

  it('should show only first 6 repos initially (pageSize)', () => {
    createComponent();
    const cards = fixture.nativeElement.querySelectorAll('.repo-card');
    expect(cards.length).toBe(mockRepos.length);
  });

  it('should display repo name', () => {
    createComponent();
    const names = fixture.nativeElement.querySelectorAll('.repo-name');
    expect(names[0].textContent?.trim()).toBe(mockRepos[0].name);
  });

  it('should display repo description', () => {
    createComponent();
    const descs = fixture.nativeElement.querySelectorAll('.repo-description');
    expect(descs[0].textContent?.trim()).toBe(mockRepos[0].description);
  });

  it('should display language', () => {
    createComponent();
    const langs = fixture.nativeElement.querySelectorAll('.repo-lang');
    expect(langs[0].textContent).toContain(mockRepos[0].language);
  });

  it('should display stars', () => {
    createComponent();
    const stars = fixture.nativeElement.querySelectorAll('.repo-stars');
    expect(stars[0].textContent).toContain(mockRepos[0].stars.toString());
  });
});
