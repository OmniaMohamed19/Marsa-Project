import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-activityditail',
  templateUrl: './activityditail.component.html',
  styleUrls: ['./activityditail.component.scss']
})
export class ActivityditailComponent {
  selectedTrip: any;

  constructor(private route: ActivatedRoute, private tripService: TripService) {}

  ngOnInit(): void {


 // Retrieve the trip object from the service
 this.selectedTrip = this.tripService.getSelectedTrip();
 console.log(this.tripService.getSelectedTrip());

 // Handle cases where the trip object is not available (e.g., direct URL access)
 if (!this.selectedTrip) {
   const typeid = this.route.snapshot.paramMap.get('typeid');

   // Fetch the trip details using the typeid if necessary
   // this.selectedTrip = ...;
 }


















  //   this.route.paramMap.subscribe(params => {
  //     const typeid = params.get('typeid');
  //     console.log(typeid);
  //  //   Fetch the trip details using the typeid
  //     this.selectedTrip =
  //   });

  ////////-------------//////////
  // this.selectedTrip=localStorage.getItem('typeTrip')
  // console.log(localStorage.getItem('typeTrip'));
  }
}
