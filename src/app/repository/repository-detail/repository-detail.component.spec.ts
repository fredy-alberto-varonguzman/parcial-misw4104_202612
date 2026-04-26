import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryDetailComponent } from './repository-detail.component';
import { RepositoryService } from '../repository.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Repository } from '../repository';
import { faker } from '@faker-js/faker';
import type { Mocked } from 'vitest';
import { of, throwError } from 'rxjs';

function createMockRepository(overrides: Partial<Repository> = {}): Repository {
  return {
    id: faker.number.int({ min: 100, max: 999 }),
    name: `repo-${faker.word.noun()}`,
    description: faker.lorem.sentence(),
    language: faker.helpers.arrayElement(['TypeScript', 'JavaScript', 'Python']),
    stars: faker.number.int({ min: 0, max: 500 }),
    createdAt: faker.date.past().toISOString().split('T')[0],
    ownerId: faker.number.int({ min: 1, max: 30 }),
    ...overrides
  };
}

describe('RepositoryDetailComponent', () => {
  let component: RepositoryDetailComponent;
  let fixture: ComponentFixture<RepositoryDetailComponent>;
  let serviceSpy: Mocked<RepositoryService>;
  let mockRepo: Repository;

  beforeEach(async () => {
    mockRepo = createMockRepository();

    serviceSpy = {
      getRepository: vi.fn().mockReturnValue(of(mockRepo))
    } as unknown as Mocked<RepositoryService>;

    await TestBed.configureTestingModule({
      imports: [RepositoryDetailComponent],
      providers: [
        { provide: RepositoryService, useValue: serviceSpy },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => mockRepo.id.toString() } } }
        }
      ]
    }).compileComponents();
  });

  function createComponent(repo: Repository | undefined = mockRepo) {
    serviceSpy.getRepository.mockReturnValue(of(repo));
    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should call getRepository with id from route', () => {
    createComponent();
    expect(serviceSpy.getRepository).toHaveBeenCalledWith(mockRepo.id);
  });

  it('should call getRepository exactly once', () => {
    createComponent();
    expect(serviceSpy.getRepository).toHaveBeenCalledTimes(1);
  });

  it('should hide spinner after data loads', () => {
    createComponent();
    expect(component.loading).toBe(false);
    expect(fixture.nativeElement.querySelector('.spinner')).toBeNull();
  });

  it('should display repository name', () => {
    createComponent();
    expect(fixture.nativeElement.querySelector('.repo-title')?.textContent?.trim())
      .toBe(mockRepo.name);
  });

  it('should display repository description', () => {
    createComponent();
    expect(fixture.nativeElement.textContent).toContain(mockRepo.description);
  });

  it('should display repository language', () => {
    createComponent();
    expect(fixture.nativeElement.textContent).toContain(mockRepo.language);
  });

  it('should display repository stars', () => {
    createComponent();
    expect(fixture.nativeElement.textContent).toContain(mockRepo.stars.toString());
  });

  it('should display createdAt date', () => {
    createComponent();
    expect(fixture.nativeElement.textContent).toContain(mockRepo.createdAt);
  });

  it('should display ownerId', () => {
    createComponent();
    expect(fixture.nativeElement.textContent).toContain(mockRepo.ownerId.toString());
  });

  it('should show back button', () => {
    createComponent();
    const btn = fixture.nativeElement.querySelector('.breadcrumb-back');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Volver al listado');
  });

  it('should show error state when repo is not found', () => {
    serviceSpy.getRepository.mockReturnValue(
    throwError(() => ({ status: 404, message: 'Not found' }))
  );
  fixture = TestBed.createComponent(RepositoryDetailComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  expect(component.error).toBe(true);
  expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
  });

  it('should show error state when service throws', () => {
    serviceSpy.getRepository.mockReturnValue(
      throwError(() => new Error(faker.lorem.sentence()))
    );
    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.error).toBe(true);
  });

  it('getStarsArray should cap at 5 when stars > 5', () => {
    createComponent(createMockRepository({ stars: 100 }));
    expect(component.getStarsArray().length).toBe(5);
  });

  it('getStarsArray should match stars when less than 5', () => {
    createComponent(createMockRepository({ stars: 3 }));
    expect(component.getStarsArray().length).toBe(3);
  });
});