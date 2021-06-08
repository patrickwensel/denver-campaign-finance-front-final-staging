import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-current-committee-contact-information',
  templateUrl: './current-committee-contact-information.component.html',
  styleUrls: ['./current-committee-contact-information.component.scss']
})
export class CurrentCommitteeContactInformationComponent implements OnInit {

  static_data: any = {};

  committeeId:any=47;
  committeeDetail:any;
  address1:any;
  address2:any;
  city:any;
  state:any;
  zipcode:any;
  campaignPhone:any;
  alternatePhone:any;
  campaignEmail:any;
  alternateEmail:any;
  website:any;
  @Input() Id: any;

  constructor( private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.getCommitteeDetails();
  }
  getCommitteeDetails(){

    this.service.getData(this.urlService.getcommitteeDetails + this.Id).subscribe((res) => {
      this.committeeDetail = res;


      this.address1=this.committeeDetail.committeeContactDetail[0].address1;
      this.address2=this.committeeDetail.committeeContactDetail[0].address2;
      this.city=this.committeeDetail.committeeContactDetail[0].city;
      this.state=this.committeeDetail.committeeContactDetail[0].state;
      this.zipcode=this.committeeDetail.committeeContactDetail[0].zip;
      this.campaignPhone=this.committeeDetail.committeeContactDetail[0].phone;
      this.alternatePhone=this.committeeDetail.committeeContactDetail[0].altPhone;
      this.campaignEmail=this.committeeDetail.committeeContactDetail[0].email;
      this.alternateEmail=this.committeeDetail.committeeContactDetail[0].altEmail;
      this.website=this.committeeDetail.committeeContactDetail[0].campaignWebsite;
    })
  }

}
