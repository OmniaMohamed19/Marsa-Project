import { HttpClient } from '@angular/common/http';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  latitudeValue: number = 0;
  longitudeValue: number = 0;
  map!: L.Map;
  marker!: L.Marker;
  searchControl = new FormControl();
  filteredOptions!: Observable<any[]>;

  constructor(
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeMap();
    this.spinner.hide();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      switchMap((name) => (name ? this._filter(name) : []))
    );
  }

  initializeMap(): void {
    this.map = L.map('leaflet-map').setView(
      [this.latitudeValue, this.longitudeValue],
      5
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/images/transport-location.png',
      iconSize: [50, 50], // Adjust size as needed
    });

    this.marker = L.marker([this.latitudeValue, this.longitudeValue], {
      icon: customIcon,
    }).addTo(this.map);

    this.map.on('click', (e) => {
      this.ngZone.run(() => {
        this.latitudeValue = e.latlng.lat;
        this.longitudeValue = e.latlng.lng;
        this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
      });
    });

    this.setCurrentLocation();
  }

  setCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.ngZone.run(() => {
          this.latitudeValue = position.coords.latitude;
          this.longitudeValue = position.coords.longitude;
          this.map.setView([this.latitudeValue, this.longitudeValue], 10);
          this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
        });
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({
      latitude: this.latitudeValue,
      longitude: this.longitudeValue,
    });
  }

  setLocation(location: any): void {
    this.spinner.hide();

    this.latitudeValue = location.lat;
    this.longitudeValue = location.lon;
    // Update map view and marker position as needed
    this.map.setView([this.latitudeValue, this.longitudeValue], 10);
    this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
  }

  private _filter(name: string): Observable<any[]> {
    this.spinner.hide();

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      name
    )}&accept-language=en`;
    return this.http.get<any[]>(url).pipe(
      map((results) => {
        if (results && results.length > 0) {
          return results.map((result) => ({
            name: result.display_name,
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
          }));
        } else {
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error occurred during location search:', error);
        return [];
      })
    );
  }

  displayFn(location: any): string {
    return location && location.name ? location.name : '';
  }
}
