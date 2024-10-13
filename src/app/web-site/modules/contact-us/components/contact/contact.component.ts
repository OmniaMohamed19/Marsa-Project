
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
  contactForm !: FormGroup;
  backgroundImageUrl:string='';

  constructor(
    private _HttpService: HttpService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getContact()
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
    })
  }
  getContact() {

    this._HttpService.get(environment.marsa, 'ContactUs').subscribe({
      next: (response: any) => {
        console.log(response);
        this.contactus = response.contactus
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(this.contactus.google);
        this.backgroundImageUrl = this.contactus.cover[0];

      }
    })
  }
  contact() {
    if (this.contactForm.invalid) {
      this.toastr.info("please enter all required fields" , ' ' ,{
        disableTimeOut: false,
        titleClass: "toastr_title",
        messageClass:"toastr_message",
        timeOut:5000,
        closeButton:true,
        })
    }
    else {
      this._HttpService.post(environment.marsa, 'contactus/store', this.contactForm.value).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message,'',{
            disableTimeOut: false,
            titleClass: "toastr_title",
            messageClass:"toastr_message",
            timeOut:5000,
            closeButton:true,
            });
          this.contactForm.reset();
        }
      })
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
}
