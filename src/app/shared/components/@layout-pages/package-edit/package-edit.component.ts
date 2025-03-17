import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { PackageSliderModalComponent } from 'src/app/shared/sliders/package-slider-modal/package-slider-modal.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss'],
})
export class PackageEditComponent implements OnInit {
  isSmallScreen = window.innerWidth <= 768;

  carouselOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    center: false,
    dots: true,       
    dotsEach: true,
    margin: 60,
    autoplay: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1,
        margin: 20,
      },
      740: {
        items: 1,
        margin: 20,
      },
      940: {
        items: 3,
        margin: 20,
      },
      1200: {
        items: 3
      }
    },
    nav: false
  };



  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSmallScreen = window.innerWidth <= 768;
  }
  tabs = [
    { label: 'Marsa Alam', section: 'section1' },
    { label: 'Hurghada', section: 'section2' },
  ];

  activeSection = 'section1'; // Initialize with a default value

  setActiveSection(section: string) {
    this.activeSection = section;
  }
  /**************************************/
  packages: any = [];
  selectedTabId: number = 0; // Initially select the first tab
  showAll: boolean = false;

  showAllTrips() {
    this.showAll = true;
  }
  constructor(
    private httpService: HttpService,
    public translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

    this.httpService.get(environment.marsa, 'package').subscribe({
      next: (res: any) => {
        this.packages = res.packages;

      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      },
    });

  }


  selectTab(index: number) {
    this.selectedTabId = index;
  }

  openPackModal(packageId: number) {
    const selectedPackage = this.packages.find(
      (pkg: any) => pkg.id === packageId
    );
    const dialogRef = this.dialog.open(PackageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.packages = selectedPackage
      ? selectedPackage.Trips
      : [];
  }
}


