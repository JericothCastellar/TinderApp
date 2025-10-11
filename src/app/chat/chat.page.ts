import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Message } from 'src/app/shared/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit {
  messages: Message[] = [];
  currentUserId: string | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.auth.currentUserId;

    this.messages = [
      {
        senderUid: this.currentUserId!,
        receiverUid: 'userB',
        text: 'Hola, ¿cómo estás?',
        timestamp: '2025-10-10T22:00:00Z'
      },
      {
        senderUid: 'userB',
        receiverUid: this.currentUserId!,
        text: 'Bien, ¿y tú?',
        timestamp: '2025-10-10T22:01:00Z'
      }
    ];
  }
}
