import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SEOService } from 'src/app/shared/services/seo.service';

@Injectable({
  providedIn: 'root',
})
export class RobotsTxtGuard implements CanActivate {
  robotsContent: any;
  robots: any;
  constructor(private seoService: SEOService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>((observer) => {
      this.seoService.getSEOData().subscribe(
        (data) => {
           this.robotsContent = data?.seo;
           this.robots= this.robotsContent.robots;
          if ( this.robots) {
            this.router.navigateByUrl('/robots.txt'); // توجيه إلى الرابط بشكل صحيح
            observer.next(true);
            observer.complete();
          } else {
            this.router.navigateByUrl('/not-found'); // في حالة عدم وجود البيانات
            observer.next(false);
            observer.complete();
          }
        },
        (error) => {
          this.router.navigateByUrl('/not-found'); // handle error
          observer.next(false);
          observer.complete();
        }
      );
    });
  }
}
