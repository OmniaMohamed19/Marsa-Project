import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../../../core/services/http/http.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss'],
})
export class DestinationComponent implements OnInit {
  destinations: any[] = [];
  visibleDestinations: any[] = [];
  currentIndex = 0;
  screenWidth: any;
  autoSlideInterval: any;

  constructor(
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 1023) {
      this.startAutoSlide();
    }
    this.httpService.get(environment.marsa, 'place').subscribe(
      (res: any) => {
        this.destinations = res.places || [];
        this.updateVisibleDestinations();
      },
      (err) => {
        console.error('Error fetching destinations:', err);
      }
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 1023) {
      this.startAutoSlide();
    } else {
      this.stopAutoSlide();
    }
  }
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000); // مدة التحرك التلقائي
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  replaceSpace(url: string): string {
    return url.replace(' ', '%20');
  }

  updateVisibleDestinations(): void {
    this.visibleDestinations = this.destinations.slice(this.currentIndex, this.currentIndex + 4);
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    } else {
      this.currentIndex = this.destinations.length - 4;
    }
    this.updateVisibleDestinations();
  }

  nextSlide(): void {
    if (this.currentIndex < this.destinations.length - 4) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
    this.updateVisibleDestinations();
  }

  logId(id: any): void {
    localStorage.setItem('destinationId', id);
    console.log('Clicked Destination ID:', id);
  }
}
