import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
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
    this.submenuAberto =
      this.submenuAberto === menu ? null : menu;
  }

  fecharMenuMobile() {
    if (this.mobile) {
      this.menuAberto = false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

}