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

  ngOnInit() {
    this.httpService
      .get(environment.marsa, 'Wishlist')
      .subscribe((res: any) => {
        console.log(res);
        
        this.wishlist = res.wishlist;
        if (this.wishlist.length > 0) {
          this.whishlistEmpty = false;
        }
      });
  }
}
