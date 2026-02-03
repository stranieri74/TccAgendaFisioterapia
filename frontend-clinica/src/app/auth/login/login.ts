import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule,
            RouterModule ]
})
export class Login {
 mensagemEsqueciSenha = 'Esqueci minha senha';
  login = '';
  senha = '';
  erro: string | null = null;
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  entrar() {
    this.erro = null;         
    this.carregando = true;

    this.authService.login(this.login, this.senha).subscribe({
      next: (res) => {
        this.authService.salvarToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 400) {
          this.erro = 'Usuário ou senha inválidos';
        } else {
          this.erro = 'Erro inesperado. Tente novamente.';
        }
      }
    });
  }
}