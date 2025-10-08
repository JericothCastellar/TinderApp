import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onRegister() {
    const { email, password } = this.form.value;
    this.loading = true;
    this.errorMessage = null;

    try {
      await this.auth.register(email, password);
      this.router.navigate(['/profile/update']);
    } catch (err: any) {
      this.errorMessage = err.message || 'Error al registrar';
    } finally {
      this.loading = false;
    }
  }
}
