import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { PerfilUsuario } from '../../core/guards/perfil-usuario.enum';

@Injectable({
  providedIn: 'root'
})
export class PerfilGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const perfisPermitidos = route.data['perfis'] as PerfilUsuario[];

    // rota sem restrição de perfil
    if (!perfisPermitidos || perfisPermitidos.length === 0) {
      return true;
    }

    if (this.authService.hasPerfil(perfisPermitidos)) {
      return true;
    }

    // perfil não autorizado
    this.router.navigate(['/dashboard']);
    return false;
  }
}