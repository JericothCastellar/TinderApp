import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserProfile } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.page.html',
  styleUrls: ['./matching.page.scss'],
  standalone: false
})
export class MatchingPage implements OnInit {
  profiles: UserProfile[] = [];
  currentIndex = 0;

  constructor(private firebase: FirebaseService, private auth: AuthService) {}

  async ngOnInit() {
    const all = await this.firebase.getAllProfiles();
    const myId = this.auth.currentUserId;
    this.profiles = all.filter(p => p.uid !== myId);
  }

  async onMatch(profile: UserProfile) {
    const myId = this.auth.currentUserId;
    await this.firebase.saveMatch(myId!, profile.uid);
    alert(`¡Match con ${profile.name}!`);
  }

  nextSlide() {
    if (this.currentIndex < this.profiles.length - 1) {
      this.currentIndex++;
    }
  }
}
