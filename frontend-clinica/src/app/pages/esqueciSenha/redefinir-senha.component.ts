import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent {

  erro = '';
  sucesso = '';

  form: any = {
    email: '',
    cpf: '',
    crefito: '',
    novaSenha: '',
    confirmarSenha: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  salvar(): void {

    this.erro = '';
    this.sucesso = '';

    if (
      !this.form.email ||
      !this.form.cpf ||
      !this.form.novaSenha ||
      !this.form.confirmarSenha
    ) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.form.novaSenha !== this.form.confirmarSenha) {
      this.erro = 'As senhas não conferem.';
      return;
    }

    const payload = {
      email: this.form.email,
      cpf: this.form.cpf,
      crefito: this.form.crefito || null,
      novaSenha: this.form.novaSenha
    };

    this.http.post(
      'http://localhost:3000/api/recuperar-senha',
      payload
    ).subscribe({
      next: () => {
        this.sucesso = 'Senha atualizada com sucesso!';
        alert('Senha atualizada com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: err => {
        this.erro =
          err?.error?.message ??
          'Erro ao atualizar senha.';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }
}