import { HttpClient } from '@angular/common/http';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    this.latitudeValue = 26.8206; // خط عرض مصر
    this.longitudeValue = 30.8025; // خط طول مصر

    this.map = L.map('googleMap').setView([this.latitudeValue, this.longitudeValue], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.carto.com/attribution">CartoDB</a>',
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
    if (!name) return new Observable((observer) => observer.next([])); // منع البحث عن نص فارغ

    this.spinner.show();

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&countrycodes=EG&accept-language=en&limit=5`;

    return this.http.get<any[]>(url).pipe(
      debounceTime(300), // يمنع إرسال طلب لكل حرف، وينتظر 300ms قبل إرسال الطلب
      distinctUntilChanged(), // يمنع إرسال نفس الطلب مرتين متتاليتين
      map((results) => {
        this.spinner.hide();
        return results.map((result) => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        }));
      }),
      catchError((error) => {
        this.spinner.hide();
        console.error('Error during location search:', error);
        return [];
      })
    );
  }



  displayFn(location: any): string {
    return location && location.name ? location.name : '';
  }
}
