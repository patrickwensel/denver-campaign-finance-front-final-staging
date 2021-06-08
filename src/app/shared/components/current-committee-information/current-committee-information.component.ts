import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, SnackbarService, LocalstorageService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-current-committee-information',
  templateUrl: './current-committee-information.component.html',
  styleUrls: ['./current-committee-information.component.scss']
})
export class CurrentCommitteeInformationComponent implements OnInit {

  static_data: any = {};
  @Input() committeeInformation: any;
  @Input() filerType: any;
  @Input() committeeId: any = 0;
  @Input() showHeader: boolean = true;
  committeeDetails: any;
  committeeName: any;
  committeeDetail: any;
  cId: any;
  committeeType: any;
  candidateName: any;
  treasurerName: any;
  electionDate: any;
  publicStatus: any;

  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    // this.getCommitteeDetails();
    if (this.committeeId) {
      let url = this.urlService.getUserEntitiesDetails;
      let type = 'AC-CAN'
      if (this.filerType == 'AC-LOB') {
        type = 'L';
        url = this.urlService.getUserEntitiesDetails;
      } else if (this.filerType == 'AC-IE') {
        type = 'IE';
        url = this.urlService.getUserEntitiesDetails;
      }
      this.getCommitteeLobbyDetail(this.committeeId, type, url);
    }
  }
  getCommitteeLobbyDetail(id: any, type: any, url: any) {
    this.service.getData(url + '?entityId=' + id + '&entityType=' + type).subscribe((res) => {
      this.committeeInformation = res;
    })
  }

  //   this.service.postDataParams(this.urlService.getCommitteeDetails+ '?committeeId=' +this.committeeId,{}).subscribe((res:any) => {
  //     this.committeeDetail = res;

  //     this.committeeName=this.committeeDetail.committeeDetail.cName;
  //     this.cId = this.committeeDetail.committeeDetail.cId;
  //     this.committeeType = this.committeeDetail.committeeDetail.cType;
  //     this.candidateName = this.committeeDetail.committeeDetail.candidateName;
  //     //this.treasurerName = this.committeeDetail.committeeDetail.;
  //     this.electionDate = this.committeeDetail.committeeDetail.electionDate;
  //     //this.publicStatus = this.committeeDetail.committeeDetail.candidateName;

  //   })
  // }

}
