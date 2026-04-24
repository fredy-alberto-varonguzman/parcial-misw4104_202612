import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Repository } from '../repository';
import { RepositoryService } from '../repository.service';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  imports: [RouterModule],
  styleUrls: ['./repository-list.component.css']
})
export class RepositoryListComponent implements OnInit {
  repositories: Repository[] = [];
  loading = true;
  error = false;

  private repositoryService = inject(RepositoryService);


  ngOnInit(): void {
    this.repositoryService.getRepositories().subscribe({
      next: (data) => {
        this.repositories = data;
        this.loading  = false;
      },
      error: () => {
        this.error = true;
        this.loading = false
      }
    });
  }

}
