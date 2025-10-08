import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/user.model';

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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private firebase: FirebaseService,
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

  async onRegister() {
    const { email, password, ...profileData } = this.form.value;
    this.loading = true;
    this.errorMessage = null;

    try {
      const user = await this.auth.register(email, password);

      const passions = profileData.passions
        ? profileData.passions.split(',').map((p: string) => ({ category: p.trim() }))
        : [];

      const profile: UserProfile = {
        uid: user.uid,
        ...profileData,
        passions,
        photos: [] // sin imagen por defecto
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
