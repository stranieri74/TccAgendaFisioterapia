import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError, tap, throwError } from 'rxjs';
import { PerfilUsuario } from '../../app/core/guards/perfil-usuario.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth/login';
  private profissionalId: number | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  login(login: string, senha: string) {
    return this.http.post<any>(this.apiUrl, {
      login,
      senha
    }).pipe(

      // Sucesso
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuarioId', String(res.usuario.id));
          localStorage.setItem('login', res.usuario.login);
          localStorage.setItem('perfil', res.usuario.perfil);
          localStorage.setItem('profissionalId', res.usuario.funcionarioId);
        }
      }),

      // Erro
      catchError(error => {
        if (error.status === 401) {
          alert('Login ou senha inválidos');
        } else if (error.status === 0) {
          alert('Servidor indisponível');
        }

        // repassa mensagem para o component
        return throwError(() => ({
          status: error.status
        }));
      })
    );
  }

  salvarToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  obterToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLogado(): boolean {
    return !!this.obterToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  getProfissionalId(): number | null {

    if (isPlatformBrowser(this.platformId)) {
      const id = localStorage.getItem('profissionalId');
      return id ? Number(id) : null;
    }

    return null;
  }

  getPerfil(): PerfilUsuario | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('perfil') as PerfilUsuario;
    }
    return null;
  }

  hasPerfil(perfis: PerfilUsuario[]): boolean {
    const perfil = this.getPerfil();
    return !!perfil && perfis.includes(perfil);
  }

  isAdmin(): boolean {
    return this.getPerfil() === PerfilUsuario.ADMIN;
  }


}