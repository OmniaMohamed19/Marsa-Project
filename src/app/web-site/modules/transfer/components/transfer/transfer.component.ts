import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent {
  persons: number = 5;
  transferDetails: any;
  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.httpService
      .get(environment.marsa, 'transfer')
      .subscribe((res: any) => {
        this.transferDetails = res;
      });
  }
  increase() {
    this.persons++;
  }
  decrease() {
    if (this.persons <= 0) {
      this.persons = 0;
    } else {
      this.persons--;
    }
  }

  tabs = [
    { label: 'with return', section: 'section1' },
    { label: 'one way', section: 'section2' },
  ];
  activeSection = 'section1'; // Initialize with a default value

  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
