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
  mobile_description: any;
  mobile_image: any;
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get(environment.marsa, 'Coupon').subscribe((res: any) => {
      this.details = res?.coupon;
    });
    this.httpService.get(environment.marsa, 'Background').subscribe((res: any) => {
      this.mobile_description = res?.mobile_section_text;
     this.mobile_image=res?.mobile_section;
    });
  }
}
