import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent {
  whishlistEmpty = true;
  wishlist: any = [];
  constructor(private httpService: HttpService) {}
  responsiveOptions: any[] | undefined;


  ngOnInit() {
    this.httpService
      .get(environment.marsa, 'Wishlist')
      .subscribe((res: any) => {
        console.log(res.wishlist);
        
        this.wishlist = res.wishlist;
        if (this.wishlist.length > 0) {
          this.whishlistEmpty = false;
        }
      });
      this.responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];
  }

}
