import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { AuthService } from './auth.service';
import { UserProfile } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private auth = inject(AuthService);

  async saveUserProfile(profile: UserProfile): Promise<void> {
    const uid = this.auth.currentUserId;
    if (!uid) throw new Error('No user logged in');
    const userRef = doc(this.firestore, 'users', uid);
    await setDoc(userRef, profile);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const uid = this.auth.currentUserId;
    if (!uid) return null;
    const userRef = doc(this.firestore, 'users', uid);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
  }

  async uploadProfilePhoto(file: Blob, filename: string): Promise<string> {
    const uid = this.auth.currentUserId;
    if (!uid) throw new Error('No user logged in');
    const path = `profile/${uid}/${filename}`;
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    const profilesRef = collection(this.firestore, 'users');
    const snapshot = await getDocs(profilesRef);
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  }
}
