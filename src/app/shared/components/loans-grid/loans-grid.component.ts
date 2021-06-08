import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods } from 'src/app/core';

@Component({
  selector: 'app-loans-grid',
  templateUrl: './loans-grid.component.html',
  styleUrls: ['./loans-grid.component.scss']
})
export class LoansGridComponent implements OnInit {
  static_data: any;
  monetaryContrebutions = new MatTableDataSource();
  constructor(
    private commonMethods: CommonMethods,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  displayedStudentsColumnsList: string[] = ["loan", "date", "amount","lender","address", "city", "state","zip","endorser","guaranteed","interest","due"];
}