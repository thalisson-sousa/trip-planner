import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.validateToken().pipe(
    tap((isValid) => {
      if (!isValid) {
        localStorage.clear();
        router.navigate(['/login']);
      }
    })
  );
};
