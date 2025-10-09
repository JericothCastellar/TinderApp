import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  email: string | null = null;
  user: UserProfile | null = null;
  profileImageUrl: string | null = null;

  constructor(
    private auth: AuthService,
    private firebase: FirebaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.email = this.auth.currentUser?.email ?? null;
    this.user = await this.firebase.getCurrentUserProfile();
    this.profileImageUrl = this.user?.photos?.[0] ?? null;
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
