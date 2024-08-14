import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private selectedTrip: any;

  setSelectedTrip(trip: any) {
    this.selectedTrip = trip;
  }

  getSelectedTrip() {
    return this.selectedTrip;
  }
}
