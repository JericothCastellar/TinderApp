import { Component, OnInit } from '@angular/core';
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
export class HomePage implements OnInit {
  email: string | null = null;
  user: UserProfile | null = null;
  profileImageUrl: string | null = null;
  hasChat = false;

  constructor(
    private auth: AuthService,
    private firebase: FirebaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.email = this.auth.currentUser?.email ?? null;
    this.user = await this.firebase.getCurrentUserProfile();
    this.profileImageUrl = this.user?.photos?.[0] ?? null;

    const uid = this.auth.currentUserId;
    if (uid) {
      this.hasChat = await this.firebase.hasMatch(uid);
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
