import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonMethods } from 'src/app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as SignaturePadNative from 'signature_pad';

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
  selector: 'app-gift-report',
  templateUrl: './gift-report.component.html',
  styleUrls: ['./gift-report.component.scss']
})
export class GiftReportComponent implements OnInit {

  static_data: any;
  dataSource: any;
  addgiftform: FormGroup;
  sttmtname: FormGroup;
  enddetails: FormGroup;
  hideRequiredMarker: boolean = true;
  public signaturePad: any='';
  public elementRef: ElementRef;
  options: any = { dotSize: 1, minWidth: 1000, minDistance: 0, canvasHeight: 300, canvasWidth: 1000 };


  constructor(
    private commonMethods: CommonMethods,
    private fb: FormBuilder,
    elementRef: ElementRef

  ) {
    this.elementRef = elementRef;
    this.options = this.options || { dotSize: 1, minWidth: 1000, minDistance: 0, canvasHeight: 300, canvasWidth: 1000 };

   }
  

  displayedColumns: string[] = ['dategiftreceived', 'donororg', 'orgtype',
  'donorname', 'donorcity', 'donorstate', 'giftdesc'];

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.dataSource = ELEMENT_DATA;
    this.initForm();
  }

  initForm() {
    this.addgiftform = this.fb.group({
      dategiftreceived  : [""],
      donororg: ["", [Validators.minLength(2), Validators.maxLength(80), Validators.required]],
      orgtype: [ "" || null,
        [
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      donorname: ["" || null, []],
      donorcity: ["" || null, []],
      donorstate: ["" || null, [Validators.maxLength(10)]],
      giftdescription: ["" || null, []],
      estimatedvalue: ["" || null, []],
      remibursement: ["" || null, []],
      whowasreim: ["" || null, []],
      amount: ["" || null, []],
      giftype:  ["" || null, []]
    });
    this.sttmtname = this.fb.group({
      statmentprepname : [""]
    });
    
    this.enddetails = this.fb.group({
      firstname : [""],
      lastname   : [""],
      email : [""]
      
    });
  }

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

}
