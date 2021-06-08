import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SigninService {
    public data = {
        firstName: "",
        lastName: "",
        email: "",
    }
    public reset_data = {
        firstName: "",
        lastName: "",
        email: "",
    }
    constructor() { }
    getData() {
        return this.data;
    }
    resetData() {
        this.data = this.reset_data
    }
}