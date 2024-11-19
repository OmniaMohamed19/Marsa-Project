import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactus: any = [];
  googleIframe!: SafeHtml;
  contactForm!: FormGroup;
  backgroundImages: string[] = [];
  backgroundImageUrl: string = '';
  currentImageIndex: number = 0;
  intervalId: any;

  constructor(
    private _HttpService: HttpService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getContact();
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      message: ['', Validators.required],
    });

  }

  getContact() {
    this._HttpService.get(environment.marsa, 'ContactUs').subscribe({
      next: (response: any) => {
        console.log(response);
        this.contactus = response.contactus;
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(this.contactus.google);
        this.backgroundImages = this.contactus.cover; // توقع أن الصور هي مصفوفة

        if (this.backgroundImages.length > 0) {
          this.backgroundImageUrl = this.backgroundImages[0]; // تعيين الصورة الأولى كبداية
          this.startImageRotation(); // بدء تغيير الصور
        }
      }
    });
  }

  startImageRotation() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
      this.backgroundImageUrl = this.backgroundImages[this.currentImageIndex];
    }, 4000); // كل 4 ثواني
  }

  contact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();

      this.toastr.info("please enter all required fields", '', {
        disableTimeOut: false,
        titleClass: "toastr_title",
        messageClass: "toastr_message",
        timeOut: 5000,
        closeButton: true,
      });
    } else {
      this._HttpService.post(environment.marsa, 'contactus/store', this.contactForm.value).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message, '', {
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass: "toastr_message",
            timeOut: 5000,
            closeButton: true,
          });
          this.contactForm.reset();
        }
      });
    }
  }


  get name() {
    return this.contactForm.get('name')!;
  }

  get email() {
    return this.contactForm.get('email')!;
  }

  get message() {
    return this.contactForm.get('message')!;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
