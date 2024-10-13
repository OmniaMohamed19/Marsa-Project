import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

interface SEOData {
  seo: string;
  metatitle: string;
  metadesc: string;
  urlslug: string;
  canonicalurl: string;
  imagealt: string;
  robots: string;
  sitemap: string;
}


@Injectable({
  providedIn: 'root'
})
export class SEOService {
   constructor(private httpService: HttpService,private titleService: Title, private metaService: Meta) {}

   ngOnInit(): void {
    this.httpService.get(environment.marsa, 'seo').subscribe((res: any) => {

    });
  }
  getSEOData(): Observable<SEOData> {
    return this.httpService.get<SEOData>(environment.marsa, 'seo');
  }
  // updateTitle(title: string) {
  //   this.titleService.setTitle(title);
  // }

  // updateDescription(description: string) {
  //   this.metaService.updateTag({ name: 'description', content: description });
  // }

  // updateKeywords(keywords: string) {
  //   this.metaService.updateTag({ name: 'keywords', content: keywords });
  // }

  // updateSEO(title: string, description: string, keywords: string) {
  //   this.updateTitle(title);
  //   this.updateDescription(description);
  //   this.updateKeywords(keywords);
  // }
}
