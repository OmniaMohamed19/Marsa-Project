import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent {
  details: any;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get(environment.marsa, 'Coupon').subscribe((res: any) => {
      this.details = res?.coupon;
    });
  }
}
