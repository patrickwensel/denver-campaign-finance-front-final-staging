import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-lobbyist-information',
  templateUrl: './lobbyist-information.component.html',
  styleUrls: ['./lobbyist-information.component.scss']
})
export class LobbyistInformationComponent implements OnInit{
  @Input() Id:any;
  static_data:any;
  info:any;
  modal:any;
  year:any;
  organisationName:any;
  firstName:any;
  lastName:any;
  address1:any;
  address2:any;
  city:any;
  state:any;
  zipCode:any;
  phone:any;
  email:any;
  orgType:any;
  showType:any = false;
  constructor(private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();

    this.getLobbyDetails();
  }
  getLobbyDetails(){
    this.service.getData(this.urlService.lobbyistContactInformation + '?lobbyistId=' + this.Id).subscribe((res:any) => {
      this.info = res;
      console.log(this.info);
      this.year = this.info.year;
      this.organisationName = this.info.orgName;
      this.firstName = this.info.firstName;
      this.lastName = this.info.lastName;
      this.address1 = this.info.address1;
      this.address2 = this.info.address2;
      this.city = this.info.city;
      this.state = this.info.stateCode;
      this.zipCode = this.info.zipCode;
      this.phone = this.info.phoneNo;
      this.email = this.info.email
      this.orgType = this.info.orgType;
      if(this.orgType === 'LOB-I'){
        this.showType = true;
      }
  })
}

}
