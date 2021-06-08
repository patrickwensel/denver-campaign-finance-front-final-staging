import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

// const detail = [
//   {
//     firstName: 'Lorem',
//     lastName: 'Ipsum',
//     OfficerType: 'Mayor',
//     isExpanded: false,
//     description: 'Test',
//     address1: 'Main Street',
//     address2: 'Main Street',
//     city: 'Tennesse',
//     state: 'California',
//     zip: '67895',
//     email: 'test@gmail.com',
//     phone: '9876543210',
//   },
//   {
//     firstName: 'Lorem',
//     lastName: 'Ipsum',
//     OfficerType: 'Mayor',
//     isExpanded: false,
//     description: 'Test',
//     address1: 'Main Street',
//     address2: 'Main Street',
//     city: 'Tennesse',
//     state: 'California',
//     zip: '67895',
//     email: 'test@gmail.com',
//     phone: '9876543210',
//   },
// ];

@Component({
  selector: 'app-current-committee-officer-information',
  templateUrl: './current-committee-officer-information.component.html',
  styleUrls: ['./current-committee-officer-information.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CurrentCommitteeOfficerInformationComponent implements OnInit {
  isTableExpanded: any;
  committeeId:any;
  committeeDetail:any;
  officerList:any=[];
  officerType:any;
  officerArray:any = [];
  modal:any;
  @Input() Id: any;

  constructor(private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getCommitteeDetails();
    console.log('==>> nnoni', this.Id);
  }


  dataSource = new MatTableDataSource();
  committeegrid: string[] = [
    'toggle',
    'firstName',
    'lastName',
    'OfficerType',
    'description',
  ];

  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.dataSource.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    });
  }
  getCommitteeDetails(){
    this.service.getData(this.urlService.getcommitteeDetails + this.Id,).subscribe((res) => {
      this.committeeDetail = res.officerDetail;
      this.dataSource.data = res.officerDetail;
      console.log(this.committeeDetail);
      // this.officerType=this.committeeDetail.committeeDetail.officerType;

      // this.officerArray= this.committeeDetail.officer;

      // for (let i = 0; i < this.committeeDetail  ; i++) {
      //   debugger;
      //   this.modal ={
      //     firstName:this.officerArray[i].firstName,
      //  lastName :this.officerArray[i].lastName,
      //   // officerType: this.officerArray[i].officeType,
      //   description: this.officerArray[i].description,
      //  address1: this.officerArray[i].uAddress1,
      //  address2 : this.officerArray[i].uAddress2,
      //  city : this.officerArray[i].uCity,
      //  state : this.officerArray[i].uState,
      //  zipcode : this.officerArray[i].uZipcode,
      //  email : this.officerArray[i].uEmail,
      //  phone : this.officerArray[i].uPhone,
      //  officerType:this.committeeDetail.committeeDetail.officerType
      //   }
      //   console.log(this.modal);
      //   data.push(this.modal);
      //   debugger;
      //   this.dataSource.data = data;
      // }
    })
  }
}
