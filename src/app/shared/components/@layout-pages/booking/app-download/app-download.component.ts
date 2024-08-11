import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-app-download',
  templateUrl: './app-download.component.html',
  styleUrls: ['./app-download.component.scss'],
})
export class AppDownloadComponent {
  details: any;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get(environment.marsa, 'Coupon').subscribe((res: any) => {
      this.details = res?.coupon;
    });
  }
}
