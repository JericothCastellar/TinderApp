import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserProfile } from 'src/app/shared/models/user.model';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'app-update-profile',
  standalone: false,
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss']
})
export class UpdatePage {
  form: FormGroup;
  previewUrl: string | null = null;
  selectedFile: Blob | null = null;
  loading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private firebase: FirebaseService) {
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

  async pickPhoto() {
    try {
      const result = await FilePicker.pickFiles({ types: ['image/*'] });
      const file = result.files[0];
      if (file.path) {
        this.selectedFile = await fetch(file.path).then(res => res.blob());
        this.previewUrl = file.path;
      }
    } catch (err) {
      this.errorMessage = 'Error al seleccionar imagen';
    }
  }

  async onSave() {
    this.loading = true;
    this.errorMessage = null;

    const raw = this.form.value;
    const passions = raw.passions.split(',').map((p: string) => ({ category: p.trim() }));
    const profile: UserProfile = {
      ...raw,
      passions,
      photos: []
    };

    try {
      if (this.selectedFile) {
        const photoUrl = await this.firebase.uploadProfilePhoto(this.selectedFile, 'profile.jpg');
        profile.photos.push(photoUrl);
      }

      await this.firebase.saveUserProfile(profile);
    } catch (err: any) {
      this.errorMessage = err.message || 'Error al guardar perfil';
    } finally {
      this.loading = false;
    }
  }
}
