import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileShareService {
  public data = {
    citySeal: "",
    cityClerkSeal: "",
    header: "",
    footer: "",
    clerkSignature: "",
    }
    constructor() { }
    getData() {
      return this.data;
    }
  }