import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ SSR NÃO BLOQUEIA ROTA
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.isLogado()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};