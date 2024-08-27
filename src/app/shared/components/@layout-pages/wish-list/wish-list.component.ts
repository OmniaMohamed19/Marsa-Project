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
  result: any = [];
  constructor(private httpService: HttpService) {}
  responsiveOptions: any[] | undefined;


  ngOnInit() {
    this.httpService
      .get(environment.marsa, 'Wishlist')
      .subscribe((res: any) => {
        console.log(res);
        
        this.wishlist = res.wishlist;
        this.result = res.categorys.map((category:any) => ({
          category: category.name,
          categoryId: category.id,
          trips: res.wishlist.filter((wish :any) => wish.trip.some((trip:any) => trip.category_id === category.id))
        }));
        
        console.log(this.result);

        if (this.wishlist.length > 0) {
          this.whishlistEmpty = false;
        }

      });
      this.responsiveOptions = [
        {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 1
        },
        {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 1
        },
        {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
        }
      ];

  }
  RemoveFromWishlist(id:any){
    console.log(id);
    
    this.httpService
        .get(environment.marsa,'Wishlist/delete/'+id)
        .subscribe({
          next: (res: any) => {
            this.httpService
      .get(environment.marsa, 'Wishlist')
      .subscribe((res: any) => {
        console.log(res);
        
        this.wishlist = res.wishlist;
        this.result = res.categorys.map((category:any) => ({
          category: category.name,
          categoryId: category.id,
          trips: res.wishlist.filter((wish :any) => wish.trip.some((trip:any) => trip.category_id === category.id))
        }));
        
        console.log(this.result);

        if (this.wishlist.length > 0) {
          this.whishlistEmpty = false;
        }

      });
            
          }
        });
    
  }

}
