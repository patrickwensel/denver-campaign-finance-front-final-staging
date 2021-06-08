import { viewClassName } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators,FormArray ,FormBuilder} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';

export let browserRefresh = true;

@Component({
  selector: 'app-manage-committees',
  templateUrl: './manage-committees.component.html',
  styleUrls: ['./manage-committees.component.scss'],
})
export class ManageCommitteesComponent implements OnInit {

  @Output() addSearchEmitter: EventEmitter<any> = new EventEmitter<any>();
  manageCommitteeForm: FormGroup;
  static_data: any;
  hideRequiredMarker: boolean = true;
  typeCommittee:any;
  userType:any;
  status:any;
  getCommitteeList:any;
  selectCommittee:any;
  officerList:any;
  searchFilers:any = new FormControl();
  searchpopular: any;
  committeeList:any;
  filerid:any;
  filername:any;
  filerStatus:any;
  lastfillingDate:any;
  createdDate:any;
  electionDate:any;
  modal:any;
  getUserType:any;
  visible:boolean=true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  manageFilerDetails:any;
  primaryUser:any;
  isExpanded: false;
  selectedFilterType="";
  selectedFilterStatus="";
  selectedFilterCType="";
  selectedFilterOffice="";
  downloadcsv:any;
  selectedFilterFilers:any;
  searchFilerss = new FormControl();
  subscription: Subscription;

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelectedStatus') private allSelectedStatus :MatOption;
  @ViewChild('allSelectedOffice') private allSelectedOffice :MatOption;
  @ViewChild('allSelectedCType') private allSelectedCType :MatOption;
  committeedisabled: any;

  constructor(
    public errorService: ErrorMessageService,
    private commonMethods: CommonMethods,
    private urlService: MasterUrlService,
    private service: ClientService,
    public router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    public masterData: MasterDataService
  ) {
    // this.txtQueryChanged.pipe(
    //   debounceTime(1000) ,// wait 1 sec after the last event before emitting last event
    //   distinctUntilChanged())// only emit if value is different from previous value
    //   .subscribe(model => {
    //     this.searchpopular = model;
    // this.addSearchEmitter.emit(this.searchpopular);

    //   });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.createManageCommittee();
    if(this.service.manageForm!=undefined){
      this.manageCommitteeForm.patchValue({
        "searchFilers": this.service.manageForm.controls.filerName,
        "filerType": this.service.manageForm.controls.filerType.value,
        "filerStatus": this.service.manageForm.controls.filerStatus.value,
        "startDate": this.service.manageForm.controls.startDate.value,
        "endDate":  this.service.manageForm.controls.endDate.value,
        "committeeType": this.service.manageForm.controls.committeeType.value,
        "office": this.service.manageForm.controls.office.value,
        "publicFundingStatus":this.service.manageForm.controls.publicFundingStatus.value
      });

    }
    this.onChangeType({});

    this.getCommitteeType();
    this.getOfficerTypeList();
    this.getCommittee();
    this.getStatus();
    //this.getManageCommitteeDetails();
    this.getFilerType();
    this.getManageFilerDetail();
    // this.subscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     browserRefresh = !this.router.navigated;
    //   }
    // });
    if(browserRefresh==true){
      this.manageCommitteeForm.reset();
    }
  }

  getSearchFilerName(event: any = null){
    let value = '';
    if (event)
      value = event.target.value;
      this.service.getData(this.urlService.getsearchFilter+ "?searchName=" + value).subscribe((res) => {
      // this.typeCommittee = res;
      // console.log(this.typeCommittee);
      this.getCommitteeList = res;
        })
  }

  committeegrid: string[] = ['filerID', 'filerName', 'status', 'primaryUser','lastFillingDate','createdDate','electionDate','view'];
  dataSource = new MatTableDataSource();

  getManageFilerDetail(){
   const searchResult = {
        filerName: this.selectedFilterFilers?this.selectedFilterFilers:"",
        filerType: this.selectedFilterType?this.selectedFilterType:"",
        filerStatus: this.selectedFilterStatus?this.selectedFilterStatus:"",
        startDate: this.manageCommitteeForm.value.startDate?this.manageCommitteeForm.value.startDate:null,
        endDate:  this.manageCommitteeForm.value.endDate?this.manageCommitteeForm.value.endDate:null,
        committeeType: this.selectedFilterCType?this.selectedFilterCType:"",
        officeType: this.selectedFilterOffice,
        electionDate: null,
        publicFundStatus:this.manageCommitteeForm.value.publicFundingStatus?this.manageCommitteeForm.value.publicFundingStatus.toString():""
    }
    console.log('==> start', searchResult);
    //

    this.service.postData(this.urlService.getManageFiler,searchResult).subscribe((res:any) => {
      this.manageFilerDetails = res;
      console.log(this.manageFilerDetails)
      const data = [];
      if(this.manageFilerDetails==""){
        this.dataSource.data=[];
      }
      else
      {
     for (let i = 0; i < this.manageFilerDetails.length; i++) {
      this.modal = {
        filerid:this.manageFilerDetails[i].filerId,
        filername:this.manageFilerDetails[i].filerName,
        filerStatus:this.manageFilerDetails[i].status,
        primaryUser:this.manageFilerDetails[i].primaryUser,
        lastfillingDate:this.manageFilerDetails[i].lastFillingDate,
        createdDate:this.manageFilerDetails[i].createdDate,
        electionDate:this.manageFilerDetails[i].electionDate,
        filerType:this.manageFilerDetails[i].filerType
      }

      data.push(this.modal);
      this.dataSource.data=[];
      setTimeout(() => {
        this.dataSource.data = data;
        this.table.renderRows();
        this.changeDetectorRefs.detectChanges();
      }, 200);
    }
     }
    })
  }

  searchText() {
    this.selectedFilterFilers = this.searchFilers?.value;
    this.getManageFilerDetail();
  }
  onInputEmpty(data:any){
    if(!data)
    this.onChangeType({});
  }

  // dateStartChange(date: any){
  //   this.onChangeType
  // }

  onChangeType(data){

    let SelectedType =[];
    if( this.manageCommitteeForm.controls.filerType.value){
      if(this.manageCommitteeForm.controls.filerType.value[0] === 0){
        for (let filters of this.getUserType) {
          SelectedType.push(filters.lookUpTypeId)
        }
      }
      else{
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
    let SelectedStatus =[];
    if( this.manageCommitteeForm.controls.filerStatus.value){
      if( this.manageCommitteeForm.controls.filerStatus.value[0] === 0){
        for (let filters of this.status) {
          SelectedStatus.push(filters.statusDesc)
        }
      }
      else{
        SelectedStatus = this.manageCommitteeForm.controls.filerStatus.value;
      }
    }
    let SelectedCType =[];
    if( this.manageCommitteeForm.controls.committeeType.value){
      if( this.manageCommitteeForm.controls.committeeType.value[0] === 0){
        for (let filters of this.typeCommittee) {
          SelectedCType.push(filters.lookUpTypeId)
        }
      }
      else{
        SelectedCType = this.manageCommitteeForm.controls.committeeType.value;
      }
    }
    let SelectedOffice =[];
    if( this.manageCommitteeForm.controls.office.value){
      if( this.manageCommitteeForm.controls.office.value[0] === 0){
        for (let filters of this.officerList) {
          SelectedOffice.push(filters.lookUpTypeId)
        }
      }
      else{
        SelectedOffice = this.manageCommitteeForm.controls.office.value;
      }
    }

    this.selectedFilterType = SelectedType ? SelectedType.toString():"";
    this.selectedFilterStatus =SelectedStatus ? SelectedStatus.toString():"";
    this.selectedFilterCType = SelectedCType ? SelectedCType.toString():"";
    this.selectedFilterOffice = SelectedOffice ? SelectedOffice.toString():"";
    if(this.manageCommitteeForm.controls.startDate.value){

    }
    // this.selectedFilterFilers = this.manageCommitteeForm.controls.searchFilerss.value;
    this.selectedFilterFilers = this.searchFilers?.value;

    this.getManageFilerDetail();
  }


  getOfficerTypeList (){
    this.officerList =[];
    this.service.getData(this.urlService.getAllOfficeList).subscribe((res: any) => {
      this.officerList = res;
      console.log(this.officerList);
    })
  }
  
  getCommitteeType() {
    this.service.getData(this.urlService.getLookUps+ "COM").subscribe((res) => {
      this.typeCommittee = res;
      // https://denverapi-dev.augustasoftsol.com/api/LookUp/getLookUps?lookUpTypeCode='COM'
    })
  }

  getStatus(){
    this.service.getData(this.urlService.getStatusList+ "?statusCode=COM-STATUS").subscribe((res) => {
      this.status = res;
      console.log(this.status);
    })
  }

  // getCommitteType(typeCommittee: any) {
  //   if (this.userType == 'USER-CAN') {
  //     return 'COM-CAN';
  //   } else if (this.userType == 'USER-TSR') {
  //     return 'COM-IC';
  //   }
  //   return typeCommittee;
  // }

  // selectedItem(data: any) {
  //   this.createManageCommittee();
  // }

  getCommittee() {
    const id = {
      searchCommitteeName: this.selectCommittee ? this.selectCommittee : "",
    };
    this.service
      .getData(this.urlService.getsearchFilter+ "?searchName=" + null)
      .subscribe((res: any) => {
        this.getCommitteeList = res;
        console.log(this.getCommitteeList);
      });
  }
  getFilerType(){
    this.service
      .getData(this.urlService.getFilerTypes + 'AC')
      .subscribe((res: any) => {
        this.getUserType = res;
      });
  }
  //FilerType
  toggleAllSelectionType() {
    if (this.allSelected.selected) {
      this.manageCommitteeForm.controls.filerType
        .patchValue([...this.getUserType.map(item => item.lookUpTypeId), 0]);
    } else {
      this.manageCommitteeForm.controls.filerType.patchValue([]);
      // this.getUserType =[];
    }
    this.onChangeType({});
  }
  tosslePerOneType(all){
    if (this.allSelected.selected) {
     this.allSelected.deselect();
     return false;
 }
   if(this.manageCommitteeForm.controls.filerType.value.length==this.getUserType.length)
     this.allSelected.select();
 }

 //FilerStatus
 toggleAllSelectionStatus() {
  if (this.allSelectedStatus.selected) {
    this.manageCommitteeForm.controls.filerStatus
      .patchValue([...this.status.map(item => item.statusDesc), 0]);
  } else {
    this.manageCommitteeForm.controls.filerStatus.patchValue([]);
    // this.status =[];
  }
  this.onChangeType({});
}

tosslePerOneStatus(all){
  if (this.allSelectedStatus.selected) {
   this.allSelectedStatus.deselect();
   return false;
}
 if(this.manageCommitteeForm.controls.filerStatus.value.length==this.status.length)
   this.allSelectedStatus.select();
}

//Office
toggleAllSelectionOffice() {
  if (this.allSelectedOffice.selected) {
    this.manageCommitteeForm.controls.office
      .patchValue([...this.officerList.map(item => item.lookUpTypeId), 0]);
  } else {
    this.manageCommitteeForm.controls.office.patchValue([]);
    // this.officerList=[];
  }
  this.onChangeType({});
}

tosslePerOneOffice(all){
  if (this.allSelectedOffice.selected) {
   this.allSelectedOffice.deselect();
   return false;
}
 if(this.manageCommitteeForm.controls.office.value.length==this.officerList.length)
   this.allSelectedOffice.select();
}

//CommitteeType
toggleAllSelectionCType() {
  if (this.allSelectedCType.selected) {
    this.manageCommitteeForm.controls.committeeType
      .patchValue([...this.typeCommittee.map(item => item.lookUpTypeId), 0]);
  } else {
    this.manageCommitteeForm.controls.committeeType.patchValue([]);
    // this.typeCommittee = [];
  }
  this.onChangeType({});
}

tosslePerOneCType(all){
  if (this.allSelectedCType.selected) {
   this.allSelectedCType.deselect();
   return false;
}
 if(this.manageCommitteeForm.controls.committeeType.value.length==this.typeCommittee.length)
   this.allSelectedCType.select();
}

  moreFilters(){
    this.visible= !this.visible;
  }


  createManageCommittee() {
    this.manageCommitteeForm = new FormGroup({
      searchFilers: new FormControl('' || null),
      filerStatus : new FormControl('' || null, []),
      filerType: new FormControl('' || null, []),
      committeeType: new FormControl('' || null),
      startDate : new FormControl('' || null),
      endDate: new FormControl('' || null),
      office: new FormControl('' || null),
      publicFundingStatus : new FormControl('' || null)
    });

    this.manageCommitteeForm.controls['committeeType'].disable();
    // this.manageCommitteeForm.patchValue({committeeType:''})
    this.manageCommitteeForm.controls['office'].disable();
    // this.manageCommitteeForm.patchValue({office:''})
  }

  viewDetails(element) {
    this.service.setManageForm(this.manageCommitteeForm);

    // if (element.filerType == "USER-LOB") {
    //   this.router.navigate(['/manage/manage_committee/lobby_approve_deny', element.filerid, element.filerType]);
    // } else if (element.filerType == "USER-CAN") {
      this.router.navigate(['/manage/manage_committee/existing-committee', element.filerid, element.filerType]);
    // } else if (element.filerType == "USER-IEF") {
    //   // this.sna
    //   // this.router.navigate(['/manage/manage_committee/existing-committee', element.filerid, element.filerType]);
    // } else if (element.filerType == "USER-TSR") {
    //   // this.router.navigate(['/manage/manage_committee/existing-committee', element.filerid, element.filerType]);
    // } else if (element.filerType == "USER-FCE") {
    //   // this.router.navigate(['/manage/manage_committee/existing-committee', element.filerid, element.filerType]);
    // }

  }



  downloadCSV(self,fileName?){
    self.hasDataLoaded = true;
    const searchResults = {
      "filerName": this.selectedFilterFilers?this.selectedFilterFilers:"",
      "filerType": this.selectedFilterType?this.selectedFilterType:"",
      "filerStatus": this.selectedFilterStatus?this.selectedFilterStatus:"",
      "lastFillingStartDate": null,
      "lastFillingEndDate": null,
      "committeType": this.selectedFilterCType?this.selectedFilterCType:"",
      "officeType": this.selectedFilterOffice,
      "publicFundStatus": ""
    }
 return this.service.postData(this.urlService.downloadCSV,searchResults).subscribe((res: any) => {
     self.hasDataLoaded = false;
     console.log(res);
    // var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
     var contentType = 'text/csv';

     var blob1 = this.b64toBlob(res.excelDocumentByte, contentType,null);
     var blobUrl1 = URL.createObjectURL(blob1);
     var a = window.document.createElement("a");
     a.href = blobUrl1
     a.download = "Manage Filer Detail.csv";
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     // window.open(blobUrl1);
   },error=>{
     self.hasDataLoaded = false;
   });
}

//Convert base64 into blob
b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}



}
