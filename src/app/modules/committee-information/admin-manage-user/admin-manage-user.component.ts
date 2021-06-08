import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { tr } from 'date-fns/locale';
import { ErrorMessageService, CommonMethods, MasterUrlService, MasterDataService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { browserRefresh } from '../../Manage-Committee/manage-committees/manage-committees.component';

@Component({
  selector: 'app-admin-manage-user',
  templateUrl: './admin-manage-user.component.html',
  styleUrls: ['./admin-manage-user.component.scss']
})
export class AdminManageUserComponent implements OnInit {
  static_data: any;
  subscription: any;
  getUserType: any;
  @Output() addSearchEmitter: EventEmitter<any> = new EventEmitter<any>();
  manageCommitteeForm: FormGroup;
  status: any;
  hideRequiredMarker: boolean = true;
  visible: boolean = true;
  getCommitteeList: any;
  searchFilers: any = new FormControl();
  selectedFilterFilers: any;
  ELEMENT_DATA: any = [
    { position: '1234', name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: '4321', name: 'Helium', weight: 4.0026, symbol: 'He' },
  ];

  displayedColumns: string[] = ['invoice_number', 'type', 'description',
    'date', 'amount', 'view_atch', 'view_invoice'];
  dataSource: any = [];
  emailForm: FormGroup;
  adminEmailForm: FormGroup;
  userStatusList = [];
  constructor(
    public errorService: ErrorMessageService,
    private commonMethods: CommonMethods,
    private urlService: MasterUrlService,
    private service: ClientService,
    public router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    public masterData: MasterDataService,
    public masterDate: MasterDataService,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.dataSource = this.ELEMENT_DATA;
    this.getUserStatusList();
    this.createManageCommittee();

    this.onChangeType({});

    this.getCommitteeType();
    // this.getOfficerTypeList();
    this.getCommittee();
    this.getStatus();
    //this.getManageCommitteeDetails();
    this.getFilerType();
    this.getManageFilerDetail();
    this.InformationForm({});
    this.InformationAdminForm({});

  }
  InformationForm(data: any) {
    this.emailForm = new FormGroup({
      email: new FormControl(data.email || null,[Validators.required, Validators.maxLength(120), Validators.pattern(this.masterDate.emailValidations)]),
      filerName: new FormControl(data.email || null,[]),
    });
  }
  InformationAdminForm(data: any) {
    this.adminEmailForm = new FormGroup({
      email: new FormControl(data.email || null,[Validators.required, Validators.maxLength(120), Validators.pattern(this.masterDate.emailValidations)]),
    });
  }

  createManageCommittee() {
    this.manageCommitteeForm = new FormGroup({
      searchFilers: new FormControl('' || null),
      filerStatus: new FormControl('' || null, []),
      filerType: new FormControl('' || null, []),
      committeeType: new FormControl('' || null),
      createdStartDate: new FormControl('' || null),
      createdEndDate: new FormControl('' || null),
      activeStartDate: new FormControl('' || null),
      activeEndDate: new FormControl('' || null),
      office: new FormControl('' || null),
      publicFundingStatus: new FormControl('' || null)
    });
  }

  searchText() {
    this.selectedFilterFilers = this.searchFilers?.value;
    this.getManageFilerDetail();
  }
  onInputEmpty(data: any) {
    if (!data)
      this.onChangeType({});
  }

  tosslePerOneType(all) {
    // if (this.allSelected.selected) {
    // this.allSelected.deselect();
    // return false;
  }

  moreFilters() {
    this.visible = !this.visible;
  }

  getSearchFilerName(event: any = null) {
    let value = '';
    if (event)
      value = event.target.value;
    this.service.getData(this.urlService.getsearchFilter + "?searchName=" + value).subscribe((res) => {
      // this.typeCommittee = res;
      // console.log(this.typeCommittee);
      this.getCommitteeList = res;
    })
  }

  onChangeType(data) {

    let SelectedType = [];
    if (this.manageCommitteeForm.controls.filerType.value) {
      if (this.manageCommitteeForm.controls.filerType.value[0] === 0) {
        for (let filters of this.getUserType) {
          SelectedType.push(filters.lookUpTypeId)
        }
      }
      else {
        SelectedType = this.manageCommitteeForm.controls.filerType.value;
      }

    }

    if (this.manageCommitteeForm.value.filerType && this.manageCommitteeForm.value.filerType.length && !this.manageCommitteeForm.value.filerType.includes('AC-TST')) {
      this.manageCommitteeForm.controls['committeeType'].disable();
      this.manageCommitteeForm.patchValue({ committeeType: '' })
      if (this.manageCommitteeForm.value.filerType && this.manageCommitteeForm.value.filerType.length && !this.manageCommitteeForm.value.filerType.includes('AC-CAN')) {
        this.manageCommitteeForm.controls['office'].disable();
        this.manageCommitteeForm.patchValue({ office: '' })
      } else {
        this.manageCommitteeForm.controls['office'].enable();
      }
    } else {
      this.manageCommitteeForm.controls['committeeType'].enable();
      this.manageCommitteeForm.controls['office'].enable();
    }
    let SelectedStatus = [];
    if (this.manageCommitteeForm.controls.filerStatus.value) {
      if (this.manageCommitteeForm.controls.filerStatus.value[0] === 0) {
        // for (let filters of this.status) {
        //   SelectedStatus.push(filters.statusDesc)
        // }
      }
      else {
        SelectedStatus = this.manageCommitteeForm.controls.filerStatus.value;
      }
    }
    let SelectedCType = [];
    if (this.manageCommitteeForm.controls.committeeType.value) {
      if (this.manageCommitteeForm.controls.committeeType.value[0] === 0) {
        // for (let filters of this.typeCommittee) {
        //   SelectedCType.push(filters.lookUpTypeId)
        // }
      }
      else {
        SelectedCType = this.manageCommitteeForm.controls.committeeType.value;
      }
    }
    let SelectedOffice = [];
    if (this.manageCommitteeForm.controls.office.value) {
      if (this.manageCommitteeForm.controls.office.value[0] === 0) {
        // for (let filters of this.officerList) {
        //   SelectedOffice.push(filters.lookUpTypeId)
        // }
      }
      else {
        SelectedOffice = this.manageCommitteeForm.controls.office.value;
      }
    }

    // this.selectedFilterType = SelectedType ? SelectedType.toString():"";
    // this.selectedFilterStatus =SelectedStatus ? SelectedStatus.toString():"";
    // this.selectedFilterCType = SelectedCType ? SelectedCType.toString():"";
    // this.selectedFilterOffice = SelectedOffice ? SelectedOffice.toString():"";
    // if(this.manageCommitteeForm.controls.startDate.value){

    // }
    // // this.selectedFilterFilers = this.manageCommitteeForm.controls.searchFilerss.value;
    // this.selectedFilterFilers = this.searchFilers?.value;

    this.getManageFilerDetail();
  }

  getUserStatusList() {
    this.service.getData(this.urlService.getLookUps+ "USER-STATUS").subscribe((res) => {
      this.userStatusList = res;
    })
  }

  tosslePerOneStatus(all) {
    // if (this.allSelectedStatus.selected) {
    //  this.allSelectedStatus.deselect();
    //  return false;
  }

  getCommitteeType() {
    // this.service.getData(this.urlService.getLookUps+ "COM").subscribe((res) => {
    //   this.typeCommittee = res;
    //   // https://denverapi-dev.augustasoftsol.com/api/LookUp/getLookUps?lookUpTypeCode='COM'
    // })
  }
  getOfficerTypeList() {
    // this.officerList =[];
    // this.service.getData(this.urlService.getAllOfficeList).subscribe((res: any) => {
    //   this.officerList = res;
    //   console.log(this.officerList);
    // })
  }
  getCommittee() {
    // const id = {
    //   searchCommitteeName: this.selectCommittee ? this.selectCommittee : "",
    // };
    // this.service
    //   .getData(this.urlService.getsearchFilter+ "?searchName=" + null)
    //   .subscribe((res: any) => {
    //     this.getCommitteeList = res;
    //     console.log(this.getCommitteeList);
    //   });
  }
  getStatus() {
    // throw new Error('Method not implemented.');
    this.service.getData(this.urlService.getStatusList + "?statusCode=COM-STATUS").subscribe((res) => {
      this.status = res;
      console.log(this.status);
    })
  }
  getFilerType() {
    this.service
      .getData(this.urlService.getFilerTypes + 'AC')
      .subscribe((res: any) => {
        this.getUserType = res;
      });
  }
  getManageFilerDetail() {
    // throw new Error('Method not implemented.');
  }
  toggleAllSelectionStatus() {
    // if (this.allSelectedStatus.selected) {
    //   this.manageCommitteeForm.controls.filerStatus
    //     .patchValue([...this.status.map(item => item.statusDesc), 0]);
    // } else {
    //   this.manageCommitteeForm.controls.filerStatus.patchValue([]);
    //   // this.status =[];
    // }
  }

  toggleAllSelectionType() {
    // if (this.allSelected.selected) {
    //   this.manageCommitteeForm.controls.filerType
    //     .patchValue([...this.getUserType.map(item => item.lookUpTypeId), 0]);
    // } else {
    //   this.manageCommitteeForm.controls.filerType.patchValue([]);
    //   // this.getUserType =[];
    // }
    // this.onChangeType({});
  }

}