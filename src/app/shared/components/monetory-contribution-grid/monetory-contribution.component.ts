import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods } from 'src/app/core';

@Component({
  selector: 'app-monetory-contribution',
  templateUrl: './monetory-contribution.component.html',
  styleUrls: ['./monetory-contribution.component.scss']
})
export class MonetoryContributionComponent implements OnInit {
  @Input() type:any
  static_data: any;
  monetaryContrebutions = new MatTableDataSource();
  constructor(
    private commonMethods: CommonMethods,
  ) { }

  ngOnInit(): void {
    console.log(this.type)
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  displayedStudentsColumnsList: string[] = ["date", "amount","desc", "contributionName","contributionType","address", "city", "state","zip","employer","occupation","cycle","edit"];
}
function input() {
  throw new Error('Function not implemented.');
}

