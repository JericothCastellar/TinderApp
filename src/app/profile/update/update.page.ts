import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserProfile } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-update-profile',
  standalone: false,
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss']
})
export class UpdatePage implements OnInit {
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private firebase: FirebaseService,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
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

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    this.loading = true;
    try {
      const profile = await this.firebase.getCurrentUserProfile();

      this.form.patchValue({
        name: profile.name,
        lastName: profile.lastName,
        birthDate: profile.birthDate,
        country: profile.country,
        city: profile.city,
        gender: profile.gender,
        showGenderProfile: profile.showGenderProfile,
        passions: profile.passions?.map(p => p.category).join(', ') || ''
      });
    } catch (err) {
      this.errorMessage = 'No se pudo cargar el perfil';
    } finally {
      this.loading = false;
    }
  }

  async onSave() {
    this.loading = true;
    this.errorMessage = null;

    const raw = this.form.value;
    const passions = raw.passions
      ? raw.passions.split(',').map((p: string) => ({ category: p.trim() }))
      : [];

    const uid = this.auth.currentUserId;
    if (!uid) {
      this.errorMessage = 'No hay sesión activa';
      this.loading = false;
      return;
    }

    const profile: UserProfile = {
      uid,
      ...raw,
      passions,
      photos: [] 
    };

    try {
      await this.firebase.saveUserProfile(profile);
    } catch (err: any) {
      this.errorMessage = err.message || 'Error al guardar perfil';
    } finally {
      this.loading = false;
    }
  }
}
