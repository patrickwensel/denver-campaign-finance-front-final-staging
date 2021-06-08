import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import {
  CommonMethods,
} from "src/app/core";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'denver';
  session = 'en';
  data: any= {};
   language =sessionStorage.getItem("lang");
   constructor(private commonMethods: CommonMethods) {
    this.commonMethods.setCurrentLanguage();
    this.data = this.commonMethods.getCurrentLanguage();
    
  }

  
}
