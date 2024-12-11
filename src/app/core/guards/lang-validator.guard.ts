import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LangValidatorGuard implements CanActivate {
  // Add your supported languages here
  private lang = localStorage.getItem('lang');
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const lang = route.paramMap.get('lang');
    if (this.lang) {
      return true;
    }
    this.router.navigate(['**']);
    return false;
  }
}
