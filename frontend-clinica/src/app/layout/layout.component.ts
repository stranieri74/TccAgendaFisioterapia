import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from '../auth/auth.service'; // ajuste o path se necessário
import { PerfilUsuario } from '../core/guards/perfil-usuario.enum';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  menuAberto = true;
  submenuAberto: string | null = null;
  mobile = false;
  PerfilUsuario = PerfilUsuario;
  // PRECISA ser public para o HTML acessar
  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    this.verificarTela();
  }

  @HostListener('window:resize')
  verificarTela() {
    this.mobile = window.innerWidth <= 768;
    if (this.mobile) {
      this.menuAberto = false;
    }
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  abrirSubmenu(menu: string) {
    this.submenuAberto = this.submenuAberto === menu ? null : menu;
  }

  fecharMenuMobile() {
    this.menuAberto = false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
  return this.authService.hasPerfil([PerfilUsuario.ADMIN]);
}

  isRecepcaoOuAdmin(): boolean {
  return this.authService.hasPerfil([
    PerfilUsuario.RECEPCAO,
    PerfilUsuario.ADMIN
  ]);
}

isTodos(): boolean {
  return this.authService.hasPerfil([
    PerfilUsuario.PROFISSIONAL,
    PerfilUsuario.RECEPCAO,
    PerfilUsuario.ADMIN
  ]);
}

isProfissionalOuAdmin(): boolean {
  return this.authService.hasPerfil([
    PerfilUsuario.PROFISSIONAL,
    PerfilUsuario.ADMIN
  ]);
}

}