import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  email: string | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.email = this.auth.currentUser?.email ?? null;
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
