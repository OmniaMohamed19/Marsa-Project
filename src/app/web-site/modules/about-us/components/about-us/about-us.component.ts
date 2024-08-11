import { AboutUs } from './../../about-us';
import { environment } from 'src/environments/environment.prod';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  data: any = [];
  partnerPaths: string[] = [];
  backgroundImageUrl: string = '';
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  videoUrl!: SafeHtml;

  constructor(
    private _HttpService: HttpService,
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAbout();
  }

  onImgError(event: any) {
    event.target.src = 'assets/custom/user-dasboard/user.jpeg';
    //Do other stuff with the event.target
  }
  getAbout() {
    this._HttpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        this.data = response;
        this.partnerPaths = Object.values(this.data.partner);
        this.backgroundImageUrl = this.data.aboutus.cover;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.data.chosse_us_video
        );
      },
    });
  }

  openVideo(): void {
    this.dialog.open(this.videoModal, {
      width: '100%',
    });
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    margin: 28,
    autoplay: true,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },
    nav: true,
  };
  aboutOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    margin: 28,
    autoplay: true,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
        center: true,
      },
      400: {
        items: 1,
        center: true,
      },
      740: {
        items: 4,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };
}
