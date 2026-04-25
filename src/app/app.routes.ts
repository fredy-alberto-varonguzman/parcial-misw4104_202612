import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'users', pathMatch: 'full'},
    { path: 'users', loadChildren: () => import('./user/user.routes').then(m => m.USER_ROUTES) },
    { path: 'repositories', loadChildren: () => import('./repository/repository.routes').then(m => m.REPOSITORY_ROUTES)}
];
