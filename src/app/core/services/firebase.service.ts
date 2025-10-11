import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { AuthService } from './auth.service';
import { UserProfile } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private auth: AuthService
  ) { }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    const uid = this.auth.currentUserId;
    if (!uid) throw new Error('No user logged in');
    const userRef = doc(this.firestore, 'users', uid);
    await setDoc(userRef, profile, { merge: true });
  }

  async getCurrentUserProfile(): Promise<UserProfile> {
    const uid = this.auth.currentUserId;
    if (!uid) throw new Error('No user logged in');
    const userRef = doc(this.firestore, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) throw new Error('Profile not found');
    return snapshot.data() as UserProfile;
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
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

  async saveMatch(fromUid: string, toUid: string): Promise<void> {
    const matchRef = doc(this.firestore, 'matches', `${fromUid}_${toUid}`);
    await setDoc(matchRef, {
      from: fromUid,
      to: toUid,
      timestamp: new Date().toISOString()
    });
  }

}
