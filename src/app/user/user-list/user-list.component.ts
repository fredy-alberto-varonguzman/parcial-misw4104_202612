import { Component, inject, OnInit } from '@angular/core';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  imports: [UserDetailComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  visibleUsers: User[] = [];
  selectedUser: User | null = null;
  loading = true;
  error = false;
  private pageSize = 5;

  private userService = inject(UserService);

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {this.users = data; this.visibleUsers = data.slice(0, this.pageSize) ; this.loading = false},
      error: () => {this.error = true; this.loading = false}
    });
  }

  selectUser(user: User): void {
    this.selectedUser = this.selectedUser?.id ? null: user;
  }

  loadMore(): void {
    const current = this.visibleUsers.length
    this.visibleUsers = this.users.slice(0, current + this.pageSize)
  }

}
