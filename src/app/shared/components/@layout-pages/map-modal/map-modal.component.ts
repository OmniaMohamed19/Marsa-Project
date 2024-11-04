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
  currentCountry: string = '';
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
    this.map = L.map('googleMap').setView([this.latitudeValue, this.longitudeValue], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.carto.com/attribution">CartoDB</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/images/locatio.svg',
      iconSize: [37, 37],
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

          // الحصول على اسم الدولة باستخدام Nominatim API
          const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitudeValue}&lon=${this.longitudeValue}&accept-language=en`;
          this.http.get<any>(reverseGeocodeUrl).subscribe((result) => {
            if (result && result.address && result.address.country) {
              this.currentCountry = result.address.country;
            }
          });
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
    this.map.setView([this.latitudeValue, this.longitudeValue], 10);
    this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
  }

  private _filter(name: string): Observable<any[]> {
    this.spinner.hide();

    // إذا كان اسم الدولة الحالية موجود ولم يكتب المستخدم دولة أخرى
    const query = this.currentCountry && !name.toLowerCase().includes(this.currentCountry.toLowerCase())
      ? `${name} ${this.currentCountry}`
      : name;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
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
