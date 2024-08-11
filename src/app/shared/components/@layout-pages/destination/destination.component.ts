import { Component, OnInit } from '@angular/core';
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

  constructor(
    private httpService: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
}
