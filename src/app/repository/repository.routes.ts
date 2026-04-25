import { Routes } from "@angular/router";
import { RepositoryListComponent } from "./repository-list/repository-list.component";
import { RepositoryDetailComponent } from "./repository-detail/repository-detail.component";

export const REPOSITORY_ROUTES: Routes = [
    { path: '',component: RepositoryListComponent },
    { path: ':id', component: RepositoryDetailComponent }
];