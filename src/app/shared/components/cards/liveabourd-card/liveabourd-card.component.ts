import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-liveabourd-card',
  templateUrl: './liveabourd-card.component.html',
  styleUrls: ['./liveabourd-card.component.scss'],
})
export class LiveabourdCardComponent {
  @Input() item: any;
  readMore = false;
  isMobile = false;
  constructor(public translate: TranslateService) {
    if (window.screen.width < 768) {
      this.isMobile = true;
    }
  }
  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
    }
  }

  getObjectKeys(obj: any): string[] {
    if (!obj || typeof obj !== 'object') {
      return [];
    }
    return Object.keys(obj);
  }
}
