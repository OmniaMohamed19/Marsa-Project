import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
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
  imageUrl!: File;
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
    private router: Router,
  ) {}

formData = new FormData();

// previewImage(files: FileList): void {
//   if (!files || files.length === 0) {
//     return;
//   }

//   this.imageUrl = files[0] as File; // Casts the first file as File

//   // Replace extensions and append to formData
//   this.formData.append(
//     'file',
//     this.imageUrl,
//     this.imageUrl.name.replace(/jpeg|png/g, 'jpg') // Replace "jpeg" or "png" with "jpg"
//   );
// }



  /********************************/
  isOpen = false;
  selectedLabel!: any;
  selectedImg!: any;
  // countries = [
  //   { name: '+20', image: '../../../../../assets/images/flags/eg.png' },
  //   { name: '+1', image: '../../../../../assets/images/flags/du.webp' },
  //   // Add more countries as needed
  // ];
  countries1:any=[]
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  ngOnInit() {
    this.httpService.get(environment.marsa, 'countrycode').subscribe((res: any) => {
      this.countries1 = res?.code;
   
     
    });
  }
  selectedCountry:any;
  ngOnChanges() {
    // Initialize selectedLabel with the first country's label
    this.name = this.userDetails?.name;
    this.phone = this.userDetails?.overviwe?.phonenumber;
     console.log(this.phone);
    this.phoneNumber = '+' +
    (this.userDetails?.overviwe?.countrycode || '') +
    (this.phone ? this.phone.replace(/\s/g, '') : '');
     console.log(this.phoneNumber);
    this.email = this.userDetails?.overviwe?.email;
    this.dob = this.userDetails?.overviwe?.dateofbirth;
   
    // if (this.countries1.length > 0) {
    //    this.selectedCountry = this.countries1.find((item: any) => {
      
    //     return item.name == '+' + this.userDetails?.overviwe?.countrycode;
    //   });
    //   this.selectedLabel = this.selectedCountry?.name;
    //   this.selectedImg = this.selectedCountry?.image;
     
    // }
    if (this.userDetails?.country ==  this.selectedCountry) {
      this.selectedLabelCountry = this.countries1.name;
      this.selectedImgCountry = this.countries1.image;
    } 
    this.selectedItem = this.items[0];
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectCountry(country: any) {
    this.selectedLabel = country.name;
    this.selectedImg = country.image;
   this.selectedCountry=this.userDetails?.country;
    this.isOpen = true;
  }
  /**************************/
  isOpenDrop = false;
  selectedLabelCountry!: string;
  selectedImgCountry!: string;
  

  toggleDropdownCountry() {
    this.isOpenDrop = !this.isOpenDrop;
  }

  selectCountryflag(country: any) {
    this.selectedLabelCountry = country.name;
    this.selectedImgCountry = country.image;
    this.selectedCountry=this.userDetails?.country;

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

  imagePreview!: string;
imageFile!: File;

previewImage(files: FileList | null): void {
  if (!files || files.length === 0) {
    return;
  }

  this.imageFile = files[0];

  const reader = new FileReader();
  reader.onload = (event: any) => {
    this.imagePreview = event.target.result;
  };
  reader.readAsDataURL(this.imageFile);
}

submit(): void {
  const formData = new FormData();
  formData.append('cover', this.imageFile);
  formData.append('email',this.email);
  formData.append('fname',this.name);
  formData.append('phone',this.phone);
  formData.append('country_code',this.phoneNumber.dialCode);
  formData.append('dateofbirth', this.dob);


  this.httpService.post(environment.marsa, 'user/update', formData, true).subscribe(
    (res) => {
      this.toastr.success('The data has been updated successfully', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    },
    (error) => {
       const errorMessage = error?.error?.message || 'Update Faild !';
      this.toastr.error(errorMessage, '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    }
  );
}



  deactivate() {
    // console.log(this.deactivateChaecked);
    if (this.deactivateChaecked) {
      this.httpService
        .get(environment.marsa, 'user/deactive')
        .subscribe((res: any) => {
          // console.log(res);
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
