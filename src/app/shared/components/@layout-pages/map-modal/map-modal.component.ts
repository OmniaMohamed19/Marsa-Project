
import { HttpClient } from '@angular/common/http';
import { Component, Inject, NgZone, OnInit, PLATFORM_ID, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  latitudeValue: number = 26.8206; // Default to Egypt
  longitudeValue: number = 30.8025; // Default to Egypt
  map: any = null;
  marker: any = null;
  searchControl = new FormControl();
  filteredOptions!: Observable<any[]>;
  currentCountry: string = '';
  private isBrowser: boolean;
  private L: any; // Leaflet instance
  mapInitialized: boolean = false;

  constructor(
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // If data contains initial coordinates, use them
    if (data && data.latitude && data.longitude) {
      this.latitudeValue = data.latitude;
      this.longitudeValue = data.longitude;
    }
  }

  ngOnInit(): void {
    this.spinner.show();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name) : of([]);
      })
    );

    if (this.isBrowser) {
      // Load Leaflet CSS
      this.loadLeafletCSS();

      // Load Leaflet JS
      this.loadLeaflet();
    }
  }

  ngAfterViewInit(): void {
    // We'll initialize the map after Leaflet is loaded
  }

  loadLeafletCSS(): void {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
      console.log('Leaflet CSS loaded');
    }
  }

  loadLeaflet(): void {
    if (!this.isBrowser) {
      this.spinner.hide();
      return;
    }

    // Check if Leaflet is already available globally
    if (window.L && typeof window.L.map === 'function') {
      console.log('Using globally available Leaflet');
      this.L = window.L;
      setTimeout(() => this.initializeMap(), 500);
      return;
    }

    // Load Leaflet dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => {
      console.log('Leaflet script loaded successfully');
      this.L = window.L;
      setTimeout(() => this.initializeMap(), 500);
    };
    script.onerror = (error) => {
      console.error('Failed to load Leaflet script:', error);
      this.spinner.hide();
    };
    document.head.appendChild(script);
  }

  initializeMap(): void {
    if (!this.isBrowser || !this.L) {
      console.error('Cannot initialize map: Browser environment or Leaflet not available');
      this.spinner.hide();
      return;
    }

    if (this.mapInitialized) {
      console.log('Map already initialized');
      this.spinner.hide();
      return;
    }

    try {
      console.log('Initializing map...');
      const mapElement = document.getElementById('googleMap');

      if (!mapElement) {
        console.error('Map container element not found');
        this.spinner.hide();
        return;
      }

      // Create map instance with English locale
      this.map = this.L.map('googleMap', {
        center: [this.latitudeValue, this.longitudeValue],
        zoom: 6,
        zoomControl: true,
        language: 'en' // Set language to English
      });

      // Add tile layer with English labels (Carto's Voyager map has good English labels)
      this.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map);

      // Create custom icon
      const customIcon = this.L.icon({
        iconUrl: 'assets/images/locatio.svg',
        iconSize: [37, 37],
        iconAnchor: [18, 37]
      });

      // Add marker
      this.marker = this.L.marker([this.latitudeValue, this.longitudeValue], {
        icon: customIcon,
        draggable: true
      }).addTo(this.map);

      // Add click event to map
      this.map.on('click', (e: any) => {
        this.ngZone.run(() => {
          this.latitudeValue = e.latlng.lat;
          this.longitudeValue = e.latlng.lng;
          this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
        });
      });

      // Add drag event to marker
      this.marker.on('dragend', (e: any) => {
        this.ngZone.run(() => {
          const position = this.marker.getLatLng();
          this.latitudeValue = position.lat;
          this.longitudeValue = position.lng;
        });
      });

      // Force a resize to ensure map renders correctly
      setTimeout(() => {
        this.map.invalidateSize();
        this.spinner.hide();
      }, 500);

      this.mapInitialized = true;
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      this.spinner.hide();
    }
  }

  setCurrentLocation(): void {
    if (!this.isBrowser) return;

    this.spinner.show();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            this.latitudeValue = position.coords.latitude;
            this.longitudeValue = position.coords.longitude;

            if (this.map && this.marker) {
              this.map.setView([this.latitudeValue, this.longitudeValue], 15);
              this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
            }

            this.spinner.hide();
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.spinner.hide();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.spinner.hide();
    }
  }

  closeDialog(): void {
    this.dialogRef.close({
      latitude: this.latitudeValue,
      longitude: this.longitudeValue,
    });
  }

  setLocation(location: any): void {
    if (!location) return;

    this.latitudeValue = location.lat;
    this.longitudeValue = location.lon;

    if (this.map && this.marker) {
      this.map.setView([this.latitudeValue, this.longitudeValue], 15);
      this.marker.setLatLng([this.latitudeValue, this.longitudeValue]);
    }
  }

  displayFn(location: any): string {
    return location ? location.name : '';
  }

  private _filter(query: string): Observable<any[]> {
    if (!query || query.length < 3) return of([]);
    if (!this.isBrowser) return of([]);

    this.spinner.show();
    // Use English locale for search
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=en`;

    return this.http.get<any[]>(url).pipe(
      map((results) => {
        this.spinner.hide();
        return results.map((result) => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        }));
      }),
      catchError(error => {
        console.error('Search error:', error);
        this.spinner.hide();
        return of([]);
      })
    );
  }
}
