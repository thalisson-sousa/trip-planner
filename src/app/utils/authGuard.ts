import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.validateToken().pipe(
    tap((isValid) => {
      if (!isValid) {
        router.navigate(['/login']);
      }
    })
  );
};
