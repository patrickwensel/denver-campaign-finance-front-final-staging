import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalstorageService, CommonMethods, ErrorMessageService, MasterDataService, MasterUrlService } from 'src/app/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  static_data: any;
  name = 'Jon Rios for City Council';
  hideRequiredMarker = true;
  contactInformationForm: FormGroup;
  constructor(
    private localStore: LocalstorageService,
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.InformationForm();
  }

  InformationForm(committeeInfo: any = {}) {
    this.contactInformationForm = new FormGroup({
      committeeName: new FormControl(committeeInfo.committeeName || null,),
      message: new FormControl(committeeInfo.message || null),
      subject: new FormControl(committeeInfo.subject || null),
      fullName: new FormControl(committeeInfo.fullName || null),
      email: new FormControl(committeeInfo.email || null),
      issueCategory: new FormControl(committeeInfo.issueCategory || null),
    });
  }

  send() {

  }

}
