import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods, ErrorMessageService, LocalstorageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-employees-grid',
  templateUrl: './employees-grid.component.html',
  styleUrls: ['./employees-grid.component.scss'],
})
export class EmployeesGridComponent implements OnInit{
  // @Input() LobbyistEmployee: any;
  @Input() Id:any;
  static_data:any;
  employee:any;
  employeeArray:any=[];
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

    this.getEmployeeDetails();
  }
  // ngOnChanges(){
  //   this.dataSource.data = [...this.LobbyistEmployee];
  //   console.log(this.dataSource.data)
  // }
  dataSource = new MatTableDataSource();
  employeegrid: string[] = [
    'firstName',
    'lastName',
    'Phone',
    'Email',
  ];
  getEmployeeDetails(){
    this.service.getData(this.urlService.lobbyEntities + this.Id + "&roleType=LOB-EMP").subscribe((res:any) => {

      this.employee = res;
      const data = this.dataSource.data;
      this.employeeArray=this.employee;
      for (let i = 0; i < this.employeeArray.length; i++) {
        this.modal ={
          firstName:this.employeeArray[i].firstName,
          lastName:this.employeeArray[i].lastName,
          phoneNo:this.employeeArray[i].phoneNo,
          emailId:this.employeeArray[i].emailId
        }
        console.log(this.modal);
        data.push(this.modal);
        this.dataSource.data = data;
      }
    })
      }
}
