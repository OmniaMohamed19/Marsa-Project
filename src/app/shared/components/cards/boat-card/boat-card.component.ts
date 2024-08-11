import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.scss']
})
export class BoatCardComponent {
  @Input() item: any;
  constructor(
    public translate:TranslateService
  ) {}
}
