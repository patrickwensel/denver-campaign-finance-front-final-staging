import { Component, OnInit } from '@angular/core';
import { LocalstorageService, CommonMethods, MasterDataService, MasterUrlService, ErrorMessageService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-committee-information-dashboard',
  templateUrl: './committee-information-dashboard.component.html',
  styleUrls: ['./committee-information-dashboard.component.scss']
})
export class CommitteeInformationDashboardComponent implements OnInit {
  static_data: any;
  name = 'Jon Rios for City Council';
  hideRequiredMarker = true;
  filerType = "";
  filerCommitteeId = 5;
  committeDetail: any = {};

  committeeInformationlabels = [{
    displayName: 'Committee Registration',
    routerLink: []
  },
  {
    displayName: 'Qualify for Public Funding',
    routerLink: []
  },
  {
    displayName: 'Withdraw from Fair Election Fund',
    routerLink: []
  },
  {
    displayName: 'Mange Users',
    routerLink: ["/committee-info-dashboard/manage-user"]
  },
  ]
  constructor(
    private localStore: LocalstorageService,
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
    private service: ClientService,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.filerType = this.localStore.getLocalStorage('user_chosen');
    this.filerCommitteeId = this.localStore.getLocalStorage('choosen_id');
    if (!this.filerType || !this.filerCommitteeId) {
      // No Committee is chossen in swith committee

    } else {
      this.getCommitteeLobbyDetail(this.filerCommitteeId, this.urlService.CommitteeDetail,(this.filerType == "committee" ? 'AC-CAN' : this.filerType == "lobbyist" ? 'AC-LOB' : 'AC-IE'));
    }
  }

  getCommitteeLobbyDetail(id: any, url: any, type: any) {
    this.service.getData(`${url}${id}&entityType=${type}`).subscribe((res) => {
      this.committeDetail = res;
    })
  }

}
