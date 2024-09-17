import {
  Component,
  HostListener,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss'],
})
export class QuickSearchComponent {


  showSearch: string = 'tour';
  @Input() changeStyle: boolean = false;
  destination: any = [];
  placeTours: any;
  dateTours: any;
  adultsNumber = 1;
  childrenNumber = 1;
  infantNumber = 1;
  activeIndex = 0;
  @ViewChild('listmobile', { static: true }) listmobile: ElementRef | undefined;
  @ViewChild('tours', { static: true }) tours: ElementRef | undefined;
  @ViewChild('liveboard', { static: true }) liveaboard: ElementRef | undefined;
  @ViewChild('transfer', { static: true }) transfer: ElementRef | undefined;
  @ViewChild('boat', { static: true }) boat: ElementRef | undefined;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private translate: TranslateService
  ) {}
  showSearchForm(value: string) {
    this.showSearch = value;
    this.scrollToActive(value);
  }
  selectedCategory: string = 'adults';
  onSelectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
  }

  getCurrentTabLabel(): string {
    switch (this.showSearch) {
      case 'tour':
        return 'Tours & Activities';
      case 'liveboard':
        return 'Liveaboard';
      case 'boat':
        return 'Boat';
      case 'transfer':
        return 'Transfer';
      default:
        return '';
    }
  }

  selectTab(tab: string) {
    this.showSearchForm(tab);
  }


  scrollToActive(value: any) {
    let activeElement: any;
    if (value == 'tour') {
      activeElement = this.tours!.nativeElement;
    } else if (value == 'liveboard') {
      activeElement = this.liveaboard!.nativeElement;
    } else if (value == 'boat') {
      activeElement = this.boat!.nativeElement;
    } else {
      activeElement = this.transfer!.nativeElement;
    }
    const containerElement = this.listmobile!.nativeElement;
    const activeElementLeft = activeElement.offsetLeft;
    const activeElementWidth = activeElement.offsetWidth;
    const containerScrollLeft = containerElement.scrollLeft;
    const containerWidth = containerElement.clientWidth;

    const activeElementRight = activeElementLeft + activeElementWidth;
    const containerRightEdge = containerScrollLeft + containerWidth;
    if (activeElementLeft < containerScrollLeft) {
      containerElement.scrollLeft = activeElementLeft - 120;
    } else if (activeElementRight > containerRightEdge) {
      containerElement.scrollLeft = activeElementRight - containerWidth + 120;
    }
  }

  ngOnInit() {

    this.httpService.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.destination = res.places;
      },
    });
  }

  setplace(ev: any) {
    this.placeTours = ev.target.value;
  }

  setDate(ev: any) {
    this.dateTours = ev.target.value;
  }

  search(route: any) {
    this.router.navigate([this.translate.currentLang + route], {
      queryParams: { place_id: this.placeTours, date: this.dateTours },
    });
  }
}
