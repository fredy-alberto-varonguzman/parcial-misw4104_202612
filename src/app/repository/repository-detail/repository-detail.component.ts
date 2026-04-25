import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Repository } from '../repository';
import { RepositoryService } from '../repository.service';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html',
  imports: [RouterModule],
  styleUrls: ['./repository-detail.component.css'],
})
export class RepositoryDetailComponent implements OnInit {
  repository: Repository | null = null;
  loading = true;
  error = false;

  private route = inject(ActivatedRoute);
  private repositoryServices = inject(RepositoryService);
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.repositoryServices.getRepository(id).subscribe({
      next: (data) => {
        this.repository = data ?? null;
        if(!this.repository) this.error = true;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
    getLangColor(lang: string): string {
    const map: Record<string, string> = {
      TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
      Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', Go: '#00ADD8',
      Rust: '#dea584', Swift: '#ffac45', Kotlin: '#A97BFF',
      'C++': '#f34b7d', 'C#': '#178600', Shell: '#89e051', YAML: '#cb171e'
    };
    return map[lang] ?? '#8c959f';
  }

  getLangBg(lang: string): string {
    const map: Record<string, string> = {
      TypeScript: '#1a6494', JavaScript: '#b89a00', Python: '#2a5885',
      Java: '#8a5a14', HTML: '#b03a1e', CSS: '#3d2a5a', Go: '#007a9a',
      Rust: '#a07060', Swift: '#cc8a30', Kotlin: '#7a55cc',
      'C++': '#b03060', 'C#': '#115500', Shell: '#5a9030', YAML: '#991010'
    };
    return map[lang] ?? '#57606a';
  }

  getStarsArray(): number[] {
    return Array(Math.min(this.repository?.stars ?? 0, 5)).fill(0);
  }
}
