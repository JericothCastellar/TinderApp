import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { SupabaseImageService } from 'src/app/core/services/supabase-image.service';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/user.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  form: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  selectedImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private firebase: FirebaseService,
    private supabaseImage: SupabaseImageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      gender: ['', Validators.required],
      showGenderProfile: [true],
      passions: ['']
    });
  }

  async selectImageMobile() {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });
    this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onRegister() {
    const { email, password, ...profileData } = this.form.value;
    this.loading = true;
    this.errorMessage = null;

    try {
      const user = await this.auth.register(email, password);
      const userId = user.uid;

      const passions = profileData.passions
        ? profileData.passions.split(',').map((p: string) => ({ category: p.trim() }))
        : [];

      let photoUrl = '';
      if (this.selectedFile) {
        const res = await this.supabaseImage.uploadProfileImage(this.selectedFile, userId);
        if (res.success && res.url) photoUrl = res.url;
      } else if (this.selectedImage) {
        const res = await this.supabaseImage.uploadProfileImageFromBase64(this.selectedImage, userId);
        if (res.success && res.url) photoUrl = res.url;
      }

      const profile: UserProfile = {
        uid: userId,
        ...profileData,
        passions,
        photos: photoUrl ? [photoUrl] : []
      };

      await this.firebase.saveUserProfile(profile);
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.errorMessage = err.message || 'Error al registrar';
    } finally {
      this.loading = false;
    }
  }
}
