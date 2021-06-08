import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonMethods, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { Location } from "@angular/common";
import { ClientService } from 'src/app/core/api-services/client.service';
import { CreateAccountService } from 'src/app/core/services/create-account.service';
@Component({
  selector: 'app-modify-forms',
  templateUrl: './modify-forms.component.html',
  styleUrls: ['./modify-forms.component.scss']
})
export class ModifyFormsComponent implements OnInit {
  static_data: any;
  getModifyForms: any;
  result: any;
  constructor(
    private commonMethods: CommonMethods,
    private location: Location,
    private service: ClientService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService,
    public masterDate: MasterDataService,
    public signIn: CreateAccountService
  ) { }
  modifyLabels = [ {
    displayName: 'City Seal',
    imageSource: this.signIn.data.sealImageUrl?this.signIn.data.sealImageUrl:null
  },
  {
    displayName: 'City Clerk Seal',
    imageSource: this.signIn.data.clerkSealImageUrl?this.signIn.data.clerkSealImageUrl:null
  },
  {
    displayName: 'Header',
    imageSource: this.signIn.data.headerImageUrl?this.signIn.data.headerImageUrl:null
  },
  {
    displayName: 'Footer',
    imageSource: this.signIn.data.footerImageUrl?this.signIn.data.footerImageUrl:null
  },
  {
    displayName: 'Clerk Signature',
    imageSource: this.signIn.data.clerkSignImageUrl?this.signIn.data.clerkSignImageUrl:null
  }
]
  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  back(){
    this.location.back();
  }
  getModifyForm() {
    this.service
      .getData(this.urlService.getModifyForms + "?appid=" + this.result)
      .subscribe((res: any) => {
        this.getModifyForms = res;
        console.log(this.getModifyForms[0])
      this.signIn.data.sealImageUrl =  this.getModifyForms[0].sealImageUrl
      this.signIn.data.clerkSealImageUrl =  this.getModifyForms[0].clerkSealImageUrl
      this.signIn.data.headerImageUrl =  this.getModifyForms[0].headerImageUrl
      this.signIn.data.footerImageUrl =  this.getModifyForms[0].footerImageUrl
      this.signIn.data.clerkSignImageUrl =  this.getModifyForms[0].clerkSignImageUrl
      });
  }
  imageIndex(e){
    if (e.join(',').replace(/,/g, '').length !== 0){
   const id = {
    appId: 0,
    appName: "string",
    themeName: "string",
    logoUrl: "string",
    favIcon: "string",
    bannerImageUrl: "string",
    sealImageUrl: e[0]?e[0]:"string",
    clerkSealImageUrl: e[1]?e[1]:"string",
    headerImageUrl: e[2]?e[2]:"string",
    footerImageUrl: e[3]?e[3]:"string",
    clerkSignImageUrl: e[4]?e[4]:"string"
    }
    this.service
          .postData(this.urlService.createModifyForm, id)
          .subscribe((res: any) => {
            this.result = res[0].pkId
            this.snackbar.snackbarError(
              "Modify forms added successfully",
              this.masterDate.centre
            );        
             this.getModifyForm();
          });
  }else{
    this.snackbar.snackbarError(
      "Please upload an image",
      this.masterDate.centre
    );      
  }
}
}
