import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-ethics-report',
  templateUrl: './ethics-report.component.html',
  styleUrls: ['./ethics-report.component.scss']
})

export class EthicsReportComponent implements OnInit {
  datasource_length: any;
  dataSource: any;

  ELEMENT_DATA: PeriodicElement[] = [
    { position: 'testtetsetseteste', name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 'testtetsetseteste', name: 'Helium', weight: 4.0026, symbol: 'He' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.dataSource = this.ELEMENT_DATA;
  }

  displayedColumns: string[] = [ 'date', 'period', 'formtype', 'details' ];

}
