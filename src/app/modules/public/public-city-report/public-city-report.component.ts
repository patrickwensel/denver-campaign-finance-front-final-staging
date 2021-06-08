import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonMethods } from 'src/app/core';

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
  selector: 'app-public-city-report',
  templateUrl: './public-city-report.component.html',
  styleUrls: ['./public-city-report.component.scss']
})
export class PublicCityReportComponent implements OnInit {
  hideRequiredMarker:boolean = true;
  giftForm: FormGroup;
  static_data: any;
  dataSource: any;
  constructor(private commonMethods: CommonMethods,) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.dataSource = ELEMENT_DATA;
    this.initGiftForm();
  }
  displayedColumns: string[] = ['dategiftreceived', 'donororg', 'orgtype'];

  initGiftForm(){
    this.giftForm = new FormGroup({
      name: new FormControl('' || null,
        [Validators.minLength(1), Validators.maxLength(150)]),
      firstName: new FormControl('' || null,
        [Validators.minLength(1), Validators.maxLength(150)]),
      lastName: new FormControl('' || null,
      [Validators.minLength(1), Validators.maxLength(150)])
      })
}

}
