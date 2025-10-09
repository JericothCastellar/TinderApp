import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseImageService {
  private supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  private bucket = 'profile-images';

  async uploadProfileImage(file: File, userId: string): Promise<{ success: boolean; url?: string; path?: string }> {
    try {
      const ext = file.name.split('.').pop();
      const fileName = `profile-${userId}.${ext}`;
      const { error } = await this.supabase.storage.from(this.bucket).upload(fileName, file, { upsert: true });
      if (error) return { success: false };

      const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(fileName);
      return { success: true, url: data.publicUrl, path: fileName };
    } catch {
      return { success: false };
    }
  }

  async uploadProfileImageFromBase64(base64: string, userId: string): Promise<{ success: boolean; url?: string; path?: string }> {
    try {
      const blob = this.base64ToBlob(base64);
      const fileName = `profile-${userId}.jpg`;
      const { error } = await this.supabase.storage.from(this.bucket).upload(fileName, blob, { upsert: true });
      if (error) return { success: false };

      const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(fileName);
      return { success: true, url: data.publicUrl, path: fileName };
    } catch {
      return { success: false };
    }
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  }
}
