import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ErrorMessageService, CommonMethods } from 'src/app/core';
import { Router } from '@angular/router';


export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
} 

@Component({
  selector: 'app-ethic-form-request',
  templateUrl: './ethic-form-request.component.html',
  styleUrls: ['./ethic-form-request.component.scss']
})
export class EthicFormRequestComponent implements OnInit {

  requestethicsForm: FormGroup;
  showsec: true;
  static_data: any;
  hideRequiredMarker: boolean = true;
  email: any;
  showform = false;
  datasource_length: any;
  dataSource: any;
  displayedColumns: string[] = [ 'date', 'period', 'formtype', 'details' ];


  ELEMENT_DATA: PeriodicElement[] = [
    { position: 'testtetsetseteste', name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 'testtetsetseteste', name: 'Helium', weight: 4.0026, symbol: 'He' },
  ];

  constructor(
    private commonMethods: CommonMethods,
    private fb: FormBuilder,
    public errorService: ErrorMessageService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.dataSource = this.ELEMENT_DATA;
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  
  ethicSecondaryFormRequest = [
    {
      displayName: 'Request Secondary User access',
      routerLink: []
    }
  ]

  initForm() {
    this.requestethicsForm = this.fb.group({
      officerType  : [""],
      department: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      app_authority: [ "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      title: ["" || null, []],
      prsl_email: ["" || null, []],
      prsl_phn: ["" || null, [Validators.maxLength(10)]],
      comments: ["" || null, []],
    });
  }


  


  gotoScreen() {
    this.showform = true;
    // console.log(item.routerLink);
    // this.router.navigate(item.routerLink);
  }
  goBacktoreq(){
    this.showform = false;
  }
}
