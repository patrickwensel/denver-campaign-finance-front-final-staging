import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonMethods } from 'src/app/core';

@Component({
  selector: 'app-matching-contribution',
  templateUrl: './matching-contribution.component.html',
  styleUrls: ['./matching-contribution.component.scss']
})
export class MatchingContributionComponent implements OnInit {
  static_data: any;
  monetaryContrebutions = new MatTableDataSource();
  constructor(
    private commonMethods: CommonMethods,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  displayedStudentsColumnsList: string[] = ["date", "amount", "contributionName","contributionType","filer","address", "city", "state","zip","employer","occupation","cycle","ytd","public","status","receipt","edit"];
}
