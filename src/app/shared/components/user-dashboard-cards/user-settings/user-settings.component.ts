import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment.prod';
interface Item {
  id: number;
  name: string;
}
@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
  imageUrl!: string;
  name: any;
  phone: any;
  phoneNumber: any;
  email: any;
  dob: any;
  deactivateChaecked = false;
  @Input() userDetails: any;
  constructor(
    private httpService: HttpService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}
  previewImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /********************************/
  isOpen = false;
  selectedLabel!: any;
  selectedImg!: any;
  countries = [
    { label: '+20', flagUrl: '../../../../../assets/images/flags/eg.png' },
    { label: '+1', flagUrl: '../../../../../assets/images/flags/du.webp' },
    // Add more countries as needed
  ];

  ngOnInit(): void {}

  ngOnChanges() {
    // Initialize selectedLabel with the first country's label
    this.name = this.userDetails?.name;
    this.phone = this.userDetails?.overviwe?.phonenumber;
    console.log(this.phone);
    this.phoneNumber =
      '+' +
      this.userDetails?.overviwe?.countrycode +
      this.phone.replace(/\s/g, '');
    console.log(this.phoneNumber);
    this.email = this.userDetails?.overviwe?.email;
    this.dob = this.userDetails?.overviwe?.dateofbirth;
    if (this.countries.length > 0) {
      let selectedCountry = this.countries.find((item: any) => {
        console.log(this.userDetails);
        console.log(
          item.label == '+' + this.userDetails?.overviwe?.countrycode
        );
        return item.label == '+' + this.userDetails?.overviwe?.countrycode;
      });
      console.log(selectedCountry);
      this.selectedLabel = selectedCountry?.label;
      this.selectedImg = selectedCountry?.flagUrl;
    }
    if (this.userDetails?.country == 'Egypt') {
      this.selectedLabelCountry = this.countries1[0].label;
      this.selectedImgCountry = this.countries1[0].flagUrl;
    } else {
      this.selectedLabelCountry = this.countries1[1].label;
      this.selectedImgCountry = this.countries1[1].flagUrl;
    }
    this.selectedItem = this.items[0];
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectCountry(country: any) {
    this.selectedLabel = country.label;
    this.selectedImg = country.flagUrl;
    this.isOpen = true;
  }
  /**************************/
  isOpenDrop = false;
  selectedLabelCountry!: string;
  selectedImgCountry!: string;
  countries1 = [
    {
      label: 'Egypt',
      flagUrl: '../../../../../assets/images/flags/eg-circle.png',
    },
    { label: 'Germany', flagUrl: '../../../../../assets/images/flags/du.webp' },
    // Add more countries as needed
  ];

  toggleDropdownCountry() {
    this.isOpenDrop = !this.isOpenDrop;
  }

  selectCountryflag(country: any) {
    this.selectedLabelCountry = country.label;
    this.selectedImgCountry = country.flagUrl;
    this.isOpenDrop = true;
  }
  /*******************************/
  items: Item[] = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
  ];

  selectedItem: Item | null = null;

  selectItem(item: Item): void {
    this.selectedItem = item;
  }

  isSelected(item: Item): boolean {
    return this.selectedItem === item;
  }

  submit() {
    console.log(this.phoneNumber);
    let body: any = {
      email: this.email,
      fname: this.name,
      phone: this.phone,
      country_code: this.phoneNumber.dialCode,
      dateofbirth: this.dob,
      cover: this.imageUrl,
    };
    Object.keys(body).forEach(
      (k: any) => (body[k] == '' || body[k] == null) && delete body[k]
    );
    console.log(body);
    this.httpService
      .post(environment.marsa, 'user/update', body, true)
      .subscribe((res) => {
        console.log(res);
        this.toastr.success('The Account updated Sucsseful', ' ', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 5000,
          closeButton: true,
        });
      });
  }

  deactivate() {
    console.log(this.deactivateChaecked);
    if (this.deactivateChaecked) {
      this.httpService
        .get(environment.marsa, 'user/deactive')
        .subscribe((res: any) => {
          console.log(res);
          this.toastr.success('The Account deactive Sucsseful', ' ', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
          this.authService.logout();
          this.router.navigate(['/']);
        });
    } else {
      this.toastr.error('Please check confirm account deactivation', ' ', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    }
  }
}
