import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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

  emailControl!: FormControl;
  passwordControl!: FormControl;
  nameControl!: FormControl;
  lastNameControl!: FormControl;
  birthDateControl!: FormControl;
  countryControl!: FormControl;
  cityControl!: FormControl;

  availablePassions: string[] = [
    'Harry Potter', 'Music', 'Video games', 'Camping', 'Beer', 'Yoga', 'Running',
    'Travel', 'Instagram', 'Gym', 'J-Pop', 'K-Pop', 'Skating', 'Reading', 'Lo-Fi',
    'Backpacking', 'Football', 'Books', 'Hiking', 'Meme', 'Cooking'
  ];

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
      passions: [[]]
    });

    this.emailControl = this.form.get('email') as FormControl;
    this.passwordControl = this.form.get('password') as FormControl;
    this.nameControl = this.form.get('name') as FormControl;
    this.lastNameControl = this.form.get('lastName') as FormControl;
    this.birthDateControl = this.form.get('birthDate') as FormControl;
    this.countryControl = this.form.get('country') as FormControl;
    this.cityControl = this.form.get('city') as FormControl;
  }

  togglePassion(passion: string) {
    const current = this.form.value.passions || [];
    const updated = current.includes(passion)
      ? current.filter((p: string) => p !== passion)
      : [...current, passion];
    this.form.patchValue({ passions: updated });
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

      const passions = Array.isArray(profileData.passions)
        ? profileData.passions.map((p: string) => ({ category: p }))
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
