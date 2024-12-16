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
  value:number;
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


  isOpen = false;
  selectedLabel!: any;
  selectedImg!: any;
  countries1:any=[];
  gender:any;
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  ngOnInit() {
   
  }
  selectedCountry:any;
  ngOnChanges() {
    this.name = this.userDetails?.name;
    this.phone = this.userDetails?.overviwe?.phonenumber;
  
    this.phoneNumber =
      '+' +
      (this.userDetails?.overviwe?.countrycode || '') +
      (this.phone ? this.phone.replace(/\s/g, '') : '');
  
    this.email = this.userDetails?.overviwe?.email;
    this.dob = this.userDetails?.overviwe?.dateofbirth;
    this.gender = this.userDetails?.overviwe?.gender;
  
    if (this.gender === 1) {
      this.selectedItem = this.items[0]; 
    } else if (this.gender === 0) {
      this.selectedItem = this.items[1]; 
    } else {
      this.selectedItem = null; 
    }
  }
  
 


  /**************************/
 


  
  /*******************************/
  items: Item[] = [
    { id: 1, name: 'Male', value: 1 }, 
    { id: 2, name: 'Female', value: 0 }, 
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
  console.log(this.selectedItem);
  const formData = new FormData();
  if (this.selectedItem?.name === 'Male') {
    formData.append('gender', '1');
  } else if (this.selectedItem?.name === 'Female') {
    formData.append('gender', '0');
  }
  // formData.append('gender', this.selectedItem ? this.selectedItem.value.toString() : '');
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
    if (this.deactivateChaecked) {
      this.httpService
        .get(environment.marsa, 'user/deactive')
        .subscribe((res: any) => {
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
