import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonMethods } from 'src/app/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as SignaturePadNative from 'signature_pad';



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface business {
  businessname: string;
  holdpersonintst: string;
}
export interface source {
  incomesource: string;
}
export interface lobbycmp {
  employer: string;
}

export interface privatetrst {
  name: string;
  description: string;
}

export interface propertyowner {
  streetcityname: string;
}

export interface asset {
  year: number;
  briefdescription: string;
}

export interface creditors {
  creditorname: string;
}

export interface employer {
  employername: string;
}

const ELEMENT_DATA: business[] = [
  { businessname: 'lhlk', holdpersonintst: 'Hydrogen', },
  // {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
];
const ELEMENT_DATA2: source[] = [
  { incomesource: 'Hydrogen' },
];

const ELEMENT_DATA3: lobbycmp[] = [
  { employer: 'Lobby' },
];
const ELEMENT_DATA4: privatetrst[] = [
  { description: 'private', name: 'Hydrogen' },
];

const ELEMENT_DATA5: propertyowner[] = [
  { streetcityname: 'Hydrogen' },
];
const ELEMENT_DATA6: asset[] = [
  { year: 1, briefdescription: 'Hydrogen' },
];
const ELEMENT_DATA7: creditors[] = [
  { creditorname: 'Hydrogen' },
];

const ELEMENT_DATA8: employer[] = [
  { employername: 'Hydrogen' },
];




@Component({
  selector: 'app-financialdisclosurestmt',
  templateUrl: './financialdisclosurestmt.component.html',
  styleUrls: ['./financialdisclosurestmt.component.scss']
})
export class FinancialdisclosurestmtComponent implements OnInit {

  static_data: any;
  contactInfoForm: FormGroup;
  businessform: FormGroup;
  sourceform: FormGroup;
  lobbycomform: FormGroup;
  propertyownerform: FormGroup;
  privatetrustform: FormGroup;
  assettransferform: FormGroup;
  creditorsform: FormGroup;
  employersform: FormGroup;
  checkboxnamefrm: FormGroup;
  enddetails: FormGroup;
  hideRequiredMarker: boolean = true;
  selectIndex: any = 0;
  // data source
  dataSourcebusinessIntrst: any;
  dataSourceIncome: any;
  dataSourcelobby: any;
  dataSourceprivate: any;
  dataSourceprptyowner: any;
  dataSourceassettrnsfrm: any;
  dataSourcecreditors: any;
  dataSourceemployers: any;
  public signaturePad: any = '';
  public elementRef: ElementRef;
  options: any = { dotSize: 1, minWidth: 1000, minDistance: 0, canvasHeight: 300, canvasWidth: 1000 };


  //   @ViewChild('myCanvas')
  //   myCanvas: ElementRef<HTMLCanvasElement>;

  // public context: CanvasRenderingContext2D;


  constructor(
    private commonMethods: CommonMethods,
    private fb: FormBuilder,
    elementRef: ElementRef

  ) {
    this.elementRef = elementRef;
    this.options = this.options || { dotSize: 1, minWidth: 1000, minDistance: 0, canvasHeight: 300, canvasWidth: 1000 };
  }

  // ngAfterViewInit(): void {
  //   this.context = this.myCanvas.nativeElement.getContext('2d');
  // }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.dataSourcebusinessIntrst = ELEMENT_DATA;
    this.dataSourceIncome = ELEMENT_DATA2;
    this.dataSourcelobby = ELEMENT_DATA3;
    this.dataSourceprivate = ELEMENT_DATA4;
    this.dataSourceprptyowner = ELEMENT_DATA5;
    this.dataSourceassettrnsfrm = ELEMENT_DATA6;
    this.dataSourcecreditors = ELEMENT_DATA7;
    this.dataSourceemployers = ELEMENT_DATA8;
    this.initForm();
    this.initbusinessform();
    this.initsourceform();
    this.initlobbyconformform();
    this.initprivateuserform();
    this.initpropertyownerform();
    this.initassettTransferform();
    this.initemployeres()
    this.initcreditorsform();
    this.initcheckboxname();
    this.initendDetails();

  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  //columns
  displayedColumns: string[] = ['dategiftreceived', 'donororg', 'donorcity'];
  displayedColumnsbsns: string[] = ['businessname', 'holdpersonintst', 'icons'];
  displayedColumnssource: string[] = ['incomesource', 'icons'];
  displayedColumnsLobbySrc: string[] = ['employer', 'icons'];
  displayedColumnsprivateTrst: string[] = ['name', 'description', 'icons'];
  displayedColumnsproperty: string[] = ['streetcityname', 'icons'];
  displayedColumnsAsset: string[] = ['year', 'briefdescription', 'icons'];
  displayedColumnscreditors: string[] = ['creditorname', 'icons'];
  displayedColumnsEmployers: string[] = ['employername', 'icons'];


  isSelected(index: number) {
    if (this.selectIndex == index) {
      return false;
    } else {
      return true;
    }
  }
  editbusiness(data: any) {
    // document.querySelector(".mat-sidenav-content").scrollTop
    this.initbusinessform(data);
  }

  editsourceincm(data: any) {
    this.initsourceform(data);
  }

  editLobbyCmp(data: any) {
    this.initlobbyconformform(data);
  }

  editPrivateTrst(data: any) {
    this.initprivateuserform(data);
  }
  editProperty(data: any) {
    this.initpropertyownerform(data);
  }

  editAssetTransfer(data: any) {
    this.initassettTransferform(data);
  }

  editCreditors(data: any) {
    this.initcreditorsform(data);
  }

  editEmployer(data: any) {
    this.initemployeres(data);
  }
  initForm(data: any = {}) {

    this.contactInfoForm = this.fb.group({
      areyou: [""],
      youwereelected: ["", [Validators.minLength(2), Validators.maxLength(80)]],
      firstname: ["" || null,
      [
        Validators.minLength(2),
        Validators.maxLength(150),
      ],
      ],
      lastname: ["" || null, []],
      bsnadd1: ["" || null, []],
      bsnadd2: ["" || null, [Validators.maxLength(10)]],
      city: ["" || null, []],
      state: ["" || null, [Validators.maxLength(10)]],
      zipcode: ["" || null, [Validators.maxLength(10)]],
      bsnphn: ["" || null, [Validators.maxLength(10)]],
      bsnmail: ["" || null, [Validators.maxLength(10)]],
    });

  }




  initbusinessform(data: any = {}) {

    this.businessform = this.fb.group({
      businessname: [data.businessname || null, [Validators.maxLength(10)]],
      holdpersonintst: [data.holdpersonintst || null, [Validators.maxLength(10)]],
    });
  }
  initsourceform(data: any = {}) {

    this.sourceform = this.fb.group({
      incomesource: [data.incomesource || null, [Validators.maxLength(10)]],
    });
  }
  initlobbyconformform(data: any = {}) {

    this.lobbycomform = this.fb.group({
      employer: [data.employer || null, [Validators.maxLength(10)]],
    });
  }
  initprivateuserform(data: any = {}) {
    this.privatetrustform = this.fb.group({
      name: [data.name || null, [Validators.maxLength(10)]],
      description: [data.description || null, [Validators.maxLength(10)]],
    });
  }

  initpropertyownerform(data: any = {}) {
    this.propertyownerform = this.fb.group({
      streetcityname: [data.streetcityname || null, [Validators.maxLength(10)]],
    });
  }

  initassettTransferform(data: any = {}) {
    this.assettransferform = this.fb.group({
      year: [data.year || null, [Validators.maxLength(10)]],
      briefdescription: [data.briefdescription || null, [Validators.maxLength(10)]],
    });
  }

  // initcrteform(data: any = {}) {
  //   this.propertyownerform = this.fb.group({
  //     streetcityname: ["" || null, [Validators.maxLength(10)]],
  //   });
  // }

  initcreditorsform(data: any = {}) {
    this.creditorsform = this.fb.group({
      creditorname: [data.creditorname || null, [Validators.maxLength(10)]],
    });
  }


  initemployeres(data: any = {}) {
    this.employersform = this.fb.group({
      employername: [data.employername || null, [Validators.maxLength(10)]],
    });
  }

  initcheckboxname() {
    this.checkboxnamefrm = this.fb.group({
      statmentprepname: [""]
    });
  }

  initendDetails() {
    this.enddetails = this.fb.group({
      firstName: [""],
      lastname: [""],
      email: [""]
    });
  }


  next() {
    this.selectIndex++;
  }

  // signature
  public ngAfterContentInit(): void {
    const canvas: any = document.querySelector('canvas');;
    if ((this.options as any).canvasHeight) {
      canvas.height = (this.options as any).canvasHeight;
    }

    if ((this.options as any).canvasWidth) {
      canvas.width = (this.options as any).canvasWidth;
    }

    this.signaturePad = new SignaturePadNative.default(canvas, this.options);
    // this.signaturePad.onBegin = this.onBegin.bind(this);
    // this.signaturePad.onEnd = this.onEnd.bind(this);
  }



  clear() {
    this.signaturePad.clear();
  }
}
