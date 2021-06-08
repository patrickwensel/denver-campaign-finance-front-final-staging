import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonMethods } from 'src/app/core';
import * as SignaturePadNative from 'signature_pad';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
];


@Component({
  selector: 'app-cityitems-report',
  templateUrl: './cityitems-report.component.html',
  styleUrls: ['./cityitems-report.component.scss']
})
export class CityitemsReportComponent implements OnInit {
  static_data: any;
  options: any = { dotSize: 1, minWidth: 1000, minDistance: 0, canvasHeight: 300, canvasWidth: 1000 };
  public signaturePad: any='';
  public elementRef: ElementRef;
  hideRequiredMarker: boolean = true;
  dataSource: any;
  cityItemreport: FormGroup;
  enddetails: FormGroup;
  sttmtname: FormGroup;



  constructor(
    private commonMethods: CommonMethods,
    private fb: FormBuilder,
    elementRef: ElementRef

  ) {
    this.elementRef = elementRef;
    this.options = this.options || { dotSize: 1, minWidth: 1000, minDistance: 0, canvasHeight: 300, canvasWidth: 1000 };

   }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.dataSource = ELEMENT_DATA;
    elementRef: ElementRef
    this.initForm();
  }

  editEmployee(data: any) {
    // document.querySelector(".mat-sidenav-content").scrollTop
    this.initForm(data);
  }

  initForm(data: any = {}) {
    this.cityItemreport = this.fb.group({
      dategiftreceived  : [data.position || null],
      donororg: [data.name || null, [Validators.minLength(2), Validators.maxLength(80), Validators.required]],
      orgtype: [ data.symbol || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
    });

    this.enddetails = this.fb.group({
      firstname : [""],
      lastname   : [""],
      email : [""]
      
    });
    this.sttmtname = this.fb.group({
      statmentprepname : [""]
    });
   
  }

    

  displayedColumns: string[] = ['dategiftreceived', 'donororg', 'orgtype',
  'donorname', 'donorcity'];

  lobbyEmployeeList = new MatTableDataSource();


    // signature
    public ngAfterContentInit(): void {
      const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
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
  clearForm() {
    this.cityItemreport.reset();
  }

  validateCancel() {
    this.clearForm();
  }


}
