import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-activityditail',
  templateUrl: './activityditail.component.html',
  styleUrls: ['./activityditail.component.scss']
})
export class ActivityditailComponent {
  tripDetail: any;

  constructor(private route: ActivatedRoute, private httpService: HttpService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.httpService.get(environment.marsa, 'trip/' + id).subscribe((res: any) => {
      this.tripDetail = res;
    });
  }

}
