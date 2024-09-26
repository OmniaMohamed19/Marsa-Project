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
  backgroundImageUrl: any = [];
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  videoUrl!: SafeHtml;
  rev: any;
  currentBackgroundImage: string = '';
  currentIndex: number = 0;
  interval: any;

  constructor(
    private _HttpService: HttpService,
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAbout();
    this.startImageRotation(); // ابدأ دورة تغيير الخلفية
  }

  onImgError(event: any) {
    event.target.src = 'assets/custom/user-dasboard/user.jpeg';
  }

  getAbout() {
    this._HttpService.get(environment.marsa, 'Background').subscribe(
      (res: any) => {
        this.backgroundImageUrl = res?.aboutus || [];
        console.log(this.backgroundImageUrl);
        if (this.backgroundImageUrl.length > 0) {
          this.currentBackgroundImage = this.backgroundImageUrl[0]; // حفظ الصورة الأولى
        }
      },
      (err) => {}
    );

    this._HttpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        this.data = response;
        console.log(this.data);

        this.rev = this.data.review;
        console.log(this.rev);
        this.partnerPaths = Object.values(this.data.partner);
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.data.chosse_us_video
        );
      },
    });
  }

  startImageRotation() {
    this.interval = setInterval(() => {
      if (this.backgroundImageUrl.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.backgroundImageUrl.length;
        this.changeBackgroundImage();
      }
    }, 4000); // تغيير الصورة كل 4 ثوانٍ
  }

  changeBackgroundImage() {
    const bgElement = document.querySelector('.bg-img-hero');
    if (bgElement) {
      bgElement.classList.remove('active'); // إزالة الكلاس active
      setTimeout(() => {
        this.currentBackgroundImage = this.backgroundImageUrl[this.currentIndex]; // تغيير الصورة
        bgElement.classList.add('active'); // إضافة الكلاس active بعد التغيير
      }, 100); // الانتظار 100 مللي ثانية قبل إضافة الكلاس
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval); // تنظيف الinterval عند تدمير المكون
  }

  openVideo(): void {
    this.dialog.open(this.videoModal, {
      width: '100%',
    });
  }

  aboutOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    margin: 10,
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
      1200: {
        items: 4,
      },
    },
    nav: true,
  };
}
