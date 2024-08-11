import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  Why_chosse_us: any;
  blogs: any = [];
  filteredBlogs: any = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];
  allCategories: any = [];
  selectedCategory: number | string = 'all';
  activeCategory: string | number = 'all';
  cover = '';
  page!: number;
  last_page!: number;
  productTotal!: number;

  constructor(
    private _httpService: HttpService,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBlogs();
    this.getAbout();
    this.route.queryParams.subscribe((params: any) => {
      this.page = +params.page ? +params.page : 1;

      if (this.page) {
        // this.updatePageQueryParam();
        this.getBlogs();
      }
    });
  }

  getAbout() {
    this._httpService.get('marsa', 'Aboutus').subscribe({
      next: (response: any) => {
        this.Why_chosse_us = response.Why_chosse_us;
      },
    });
  }

  getBlogs() {
    this.blogs = [];
    this.pages = [];
    this._httpService.get('marsa', `blog`, { page: this.page }).subscribe({
      next: (response: any) => {
        this.blogs = response?.Blogs?.data;
        this.cover = response?.cover;
        this.filteredBlogs = this.blogs;
        this.allCategories = response?.allCategory;
        this.last_page = response?.Blogs?.last_page;
        this.productTotal = response?.Blogs?.total;
        this.pages = Array.from({ length: this.last_page }, (_, i) => i + 1);
      },
    });
  }

  next() {
    this.page = this.page < this.last_page ? this.page + 1 : this.page;
    this.updatePageQueryParam();
    this.getBlogs();
  }
  previous() {
    this.page = this.page > 1 ? this.page - 1 : this.page;
    this.updatePageQueryParam();
    this.getBlogs();
  }

  private updatePageQueryParam() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page },
      queryParamsHandling: 'merge',
    });
  }

  navigateByPage(page: number) {
    this.page = page;
    this.updatePageQueryParam();
    this.getBlogs();
  }

  filterByCategory(categoryId: string | number) {
    this.activeCategory = categoryId;
    if (categoryId === 'all') {
      this.filteredBlogs = this.blogs;
    } else {
      this.filteredBlogs = this.blogs.filter(
        (blog: any) => blog.category_id === categoryId
      );
    }
  }

  getUniqueTags() {
    const uniqueTags = new Set<string>();
    this.filteredBlogs.forEach((blog: any) => {
      blog.seo.forEach((tag: any) => {
        uniqueTags.add(tag);
      });
    });
    return Array.from(uniqueTags);
  }

  carouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 0,
    navSpeed: 900,
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
}
