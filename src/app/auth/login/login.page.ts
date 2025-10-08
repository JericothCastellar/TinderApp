import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  form: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onLogin() {
    const { email, password } = this.form.value;
    this.loading = true;
    this.errorMessage = null;

    try {
      await this.auth.login(email, password);
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.errorMessage = err.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
