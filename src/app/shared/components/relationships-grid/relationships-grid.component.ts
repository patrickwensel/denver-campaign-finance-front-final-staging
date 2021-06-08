import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-relationships-grid',
  templateUrl: './relationships-grid.component.html',
  styleUrls: ['./relationships-grid.component.scss']
})
export class RelationshipsGridComponent implements OnInit {
  @Input() Id:any;
static_data:any;
relationship:any;
relationshipArray:any=[];
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

  this.getRelationshipsDetails();
}
  dataSource = new MatTableDataSource();
  relationshipgrid: string[] = [
    'lobbyist',
    'officialName',
    'officialTitle',
    'relationship',
    'entityName',
  ];

  getRelationshipsDetails(){
    this.service.getData(this.urlService.lobbyEntities + this.Id + "&roleType=LOB-REL").subscribe((res:any) => {
      this.relationship = res;
      const data = this.dataSource.data;
      this.relationshipArray=this.relationship;
      for (let i = 0; i < this.relationshipArray.length; i++) {
        this.modal ={
          lobbyist:this.relationshipArray[i].lobFullName,
          officeName:this.relationshipArray[i].officialName,
          officeTitle:this.relationshipArray[i].officialTitle,
          relationship:this.relationshipArray[i].relationship,
          entityName:this.relationshipArray[i].entityName
        }
        console.log(this.modal);
        data.push(this.modal);
        this.dataSource.data = data;
      }
    })
      }

}
