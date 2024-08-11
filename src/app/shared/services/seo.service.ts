import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  constructor(private titleService: Title, private metaService: Meta) {}

  updateTitle(title: string) {
    this.titleService.setTitle(title);
  }

  updateDescription(description: string) {
    this.metaService.updateTag({ name: 'description', content: description });
  }

  updateKeywords(keywords: string) {
    this.metaService.updateTag({ name: 'keywords', content: keywords });
  }

  updateSEO(title: string, description: string, keywords: string) {
    this.updateTitle(title);
    this.updateDescription(description);
    this.updateKeywords(keywords);
  }
}
