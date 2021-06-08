import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  public data = {
  contactInformationID: 0,
  firstName: "",
  lastName: "",
  mailingAddress1: "",
  mailingAddress2: "",
  city: "",
  state: "",
  zipcode: "",
  phone: "",
  email:"",
  occupation: "",
  employer: "",
  organization: "",
  bannerImageUrl: "",
  clerkSealImageUrl: "",
  clerkSignImageUrl: "",
  favIcon: "",
  footerImageUrl: "",
  headerImageUrl: "",
  logoUrl: "",
  sealImageUrl: "",
  themeName: ""
  }
  constructor() { }
  getData() {
    return this.data;
  }
}
