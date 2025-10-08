import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth); // ← ahora es privado
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this._auth, (user) => {
      this.userSubject.next(user);
    });
  }

  async register(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this._auth, email, password);
    this.userSubject.next(credential.user);
    return credential.user;
  }

  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this._auth, email, password);
    this.userSubject.next(credential.user);
    return credential.user;
  }

  async logout(): Promise<void> {
    await signOut(this._auth);
    this.userSubject.next(null);
  }

  get currentUser(): User | null {
    return this._auth.currentUser;
  }

  get currentUserId(): string | null {
    return this._auth.currentUser?.uid ?? null;
  }

  get rawAuth(): Auth {
    return this._auth;
  }
}
