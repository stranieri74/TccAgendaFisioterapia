import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';

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

      tap(res => {
        if (isPlatformBrowser(this.platformId)) {

          // token
          localStorage.setItem('token', res.token);

          // usuário
          localStorage.setItem('usuarioId', String(res.usuario.id));
          localStorage.setItem('login', res.usuario.login);
          localStorage.setItem('perfil', res.usuario.perfil);

          localStorage.setItem(
            'profissionalId',
            res.usuario.funcionarioId
          );
        }
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

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  isLogado(): boolean {
    return !!this.obterToken();
  }

  getProfissionalId(): number | null {

    if (isPlatformBrowser(this.platformId)) {
      const id = localStorage.getItem('profissionalId');
      return id ? Number(id) : null;
    }

    return null;
  }
}