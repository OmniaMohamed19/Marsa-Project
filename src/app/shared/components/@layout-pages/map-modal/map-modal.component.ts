import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  latitudeValue: number = 0;
  longitudeValue: number = 0;
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  searchControl = new FormControl();
  filteredOptions!: Observable<any[]>;
  currentCountry: string = '';
  private isBrowser: boolean;

  constructor(
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadLeaflet().then(() => {
        this.initializeMap();
        this.setupSearch();
      }).catch(err => {
        console.error('Failed to load Leaflet:', err);
      });
    } else {
      this.setupSearch();
    }
  }

  private async loadLeaflet(): Promise<void> {
    if (typeof L === 'undefined') {
      await import('leaflet');
    }
  }

  private setupSearch(): void {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this._filter(value))
    );
  }

  initializeMap(): void {
    if (!this.isBrowser || typeof L === 'undefined') {
      console.error('Leaflet not available');
      return;
    }

    try {
      this.latitudeValue = this.data?.latitude || 26.8206;
      this.longitudeValue = this.data?.longitude || 30.8025;

      this.map = L.map('googleMap').setView([this.latitudeValue, this.longitudeValue], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      const customIcon = L.icon({
        iconUrl: 'assets/images/locatio.svg',
        iconSize: [37, 37],
      });

      this.marker = L.marker([this.latitudeValue, this.longitudeValue], {
        icon: customIcon,
        draggable: true
      }).addTo(this.map);

      this.marker.on('dragend', () => {
        const position = this.marker!.getLatLng();
        this.ngZone.run(() => {
          this.latitudeValue = position.lat;
          this.longitudeValue = position.lng;
        });
      });

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.ngZone.run(() => {
          this.latitudeValue = e.latlng.lat;
          this.longitudeValue = e.latlng.lng;
          this.marker!.setLatLng([this.latitudeValue, this.longitudeValue]);
        });
      });

    } catch (error) {
      console.error('Leaflet initialization error:', error);
    }
  }

  setCurrentLocation(): void {
    if (!this.isBrowser || !navigator.geolocation) return;

    this.spinner.show();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.ngZone.run(() => {
          this.latitudeValue = position.coords.latitude;
          this.longitudeValue = position.coords.longitude;
          
          if (this.map) {
            this.map.setView([this.latitudeValue, this.longitudeValue], 15);
            this.marker!.setLatLng([this.latitudeValue, this.longitudeValue]);
          }

          this.spinner.hide();
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        this.spinner.hide();
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close({
      latitude: this.latitudeValue,
      longitude: this.longitudeValue,
    });
  }

  setLocation(location: any): void {
    this.latitudeValue = location.lat;
    this.longitudeValue = location.lon;
    
    if (this.map) {
      this.map.setView([this.latitudeValue, this.longitudeValue], 15);
      this.marker!.setLatLng([this.latitudeValue, this.longitudeValue]);
    }
  }

  private _filter(value: string | any): Observable<any[]> {
    const query = typeof value === 'string' ? value.trim() : '';
    if (query.length < 3) return of([]);

    this.spinner.show();
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;

    return this.http.get<any[]>(url).pipe(
      map(results => {
        return results.map(result => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        }));
      }),
      catchError(error => {
        console.error('Search error:', error);
        return of([]);
      }),
      switchMap(results => {
        this.spinner.hide();
        return of(results);
      })
    );
  }

  displayFn(location: any): string {
    return location?.name || '';
  }
}