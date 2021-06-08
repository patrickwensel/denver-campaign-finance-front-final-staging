import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-client-grid',
  templateUrl: './client-grid.component.html',
  styleUrls: ['./client-grid.component.scss'],
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
export class ClientGridComponent implements OnInit {
  @Input() Id:any;
  static_data:any;
  clients:any;
  clientArray:any=[];
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

    this.getClientsDetails();
  }
  dataSource = new MatTableDataSource();
  clientgrid: string[] = [

    // 'companyName',
    // 'lobbyist',
    // 'business',
    // 'matters',
    'companyName',
    'type',
    'business',
    'legislativeMatters',
    'address1',
     'address2',
     'city',
    'state',
     'zip'
  ];
  getClientsDetails(){
    this.service.getData(this.urlService.lobbyEntities + this.Id + "&roleType=LOB-CLI").subscribe((res:any) => {
      this.clients = res;
      console.log(this.clients);
      const data = this.dataSource.data;
      this.clientArray=this.clients;
      for (let i = 0; i < this.clientArray.length; i++) {
        this.modal ={

          cAddress1:this.clientArray[i].address1,
          cAddress2:this.clientArray[i].address2,
          userType:this.clientArray[i].contactType,
          organisationName:this.clientArray[i].orgName,
          natureOfBusiness:this.clientArray[i].natureOfBusiness,
          lMatters:this.clientArray[i].legislativeMatters,
          ccity:this.clientArray[i].city,
          cstate:this.clientArray[i].stateCode,
          czip:this.clientArray[i].zipCode
        }
        console.log(this.modal);
        data.push(this.modal);
        this.dataSource.data = data;
      }
    })
  }
}
