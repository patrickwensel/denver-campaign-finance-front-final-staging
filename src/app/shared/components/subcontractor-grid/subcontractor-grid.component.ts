import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-subcontractor-grid',
  templateUrl: './subcontractor-grid.component.html',
  styleUrls: ['./subcontractor-grid.component.scss']
})
export class SubcontractorGridComponent implements OnInit {
//  @Input() LobbyistSubcontractor:any
@Input() Id:any;
static_data:any;
subcontractor:any;
subcontractorArray:any=[];
modal:any;
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

  this.getSubContractorDetails();
}

  dataSource = new MatTableDataSource();
  subcontractorgrid: string[] = [
    'type',
    'subcontractorName',
    'firstName',
    'lastName',
    'Phone',
    'Email',
  ];
  getSubContractorDetails(){
    this.service.getData(this.urlService.lobbyEntities + this.Id + "&roleType=LOB-SUB").subscribe((res:any) => {
      this.subcontractor = res;
      const data = this.dataSource.data;
      this.subcontractorArray=this.subcontractor;
      for (let i = 0; i < this.subcontractorArray.length; i++) {
        this.modal ={
          firstName:this.subcontractorArray[i].firstName + " ",
          lastName:this.subcontractorArray[i].lastName,
          phoneNo:this.subcontractorArray[i].phoneNo,
          emailId:this.subcontractorArray[i].emailId,
          organisationName:this.subcontractorArray[i].orgName,
          contactType: this.subcontractorArray[i].contactType,
          fullName: this.subcontractorArray[i].fullName

        }
        console.log(this.modal);
        data.push(this.modal);
        this.dataSource.data = data;
      }
    })
      }

}
