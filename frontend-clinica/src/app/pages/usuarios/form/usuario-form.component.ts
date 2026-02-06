import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {

  sucesso = '';
  erro = '';
  carregando = false;
  editando = false;
  id!: number;
  funcionarios: any[] = [];

  usuario: any = {
    login: '',
    senhaHash: '',
    perfil: 'ADMIN',
    ativo: 0,
    funcionarioId: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.buscarFuncionarios();
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        this.editando = true;
        this.id = Number(idParam);
        this.buscarUsuario();
      } else {
        this.editando = false;
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.usuario = {
      login: '',
      senhaHash: '',
      perfil: 'ADMIN',
      ativo: 0,
      funcionarioId: ''
    };

    this.cd.detectChanges();
  }

  // BUSCAR Funcionarios
  buscarUsuario() {
    this.carregando = true;

    this.http
      .get<any>(`http://localhost:3000/api/usuarios?id=${this.id}`)
      .subscribe({
        next: res => {

          this.usuario = res;
          this.carregando = false;
          this.cd.detectChanges();
        },

        error: () => {
          this.erro = 'Erro ao carregar usuario';
          this.carregando = false;
          this.cd.detectChanges();
        }
      });
  }

  buscarFuncionarios() {
    this.http
      .get<any[]>('http://localhost:3000/api/funcionarios')
      .subscribe({
        next: res => {
          this.funcionarios = res;
          this.cd.detectChanges();
        },
        error: () => {
          this.erro = 'Erro ao carregar funcionários';
        }
      });
  }

  // SALVAR
  salvar() {

    this.erro = '';
    this.sucesso = '';
    this.carregando = true;

    const usuarioEnvio: any = {
      login: this.usuario.login,
      perfil: this.usuario.perfil,
      funcionarioId: Number(this.usuario.funcionarioId),
      ativo: this.usuario.ativo ? 1 : 0
    };

    if (this.usuario.senhaHash && this.usuario.senhaHash.trim() !== '') {
      usuarioEnvio.senha = this.usuario.senhaHash;
    }

    const request = this.editando
      ? this.http.put(
        'http://localhost:3000/api/usuarios',
        { ...usuarioEnvio, id: this.id }
      )
      : this.http.post(
        'http://localhost:3000/api/usuarios',
        usuarioEnvio
      );

    request.subscribe({
      next: () => {
        this.carregando = false;

        this.sucesso = this.editando
          ? 'usuario atualizado com sucesso!'
          : 'usuario cadastrado com sucesso!';

        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 1000);
      },

      error: (err: HttpErrorResponse) => {
        this.carregando = false;

        if (err.error?.message) {

          if (typeof err.error.message === 'string') {
            this.erro = err.error.message;

          } else if (Array.isArray(err.error.message)) {
            this.erro = err.error.message.join(' | ');
          }

        } else if (err.error?.error) {
          this.erro = err.error.error;
        } else {
          this.erro = 'Erro inesperado ao salvar usuario.';
        }

        this.cd.detectChanges();
      }
    });
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }
}