import { Component, OnInit } from '@angular/core';
import { CommonMethods } from 'src/app/core';

@Component({
  selector: 'app-covered-official-dashboard',
  templateUrl: './covered-official-dashboard.component.html',
  styleUrls: ['./covered-official-dashboard.component.scss']
})
export class CoveredOfficialDashboardComponent implements OnInit {
  static_data: any;

  name = 'Jon Rios for City Council';

  coveredofficiallabels = [{
    displayName: 'Gift Report',
    routerLink: ['/filing/Gift_Report']
  },
  {
    displayName: 'City Items Report',
    routerLink: ['/filing/city_items']
  },
  {
    displayName: 'Financial Disclosure Statement',
    routerLink: ['/filing/financial_disclosure']
  },
  {
    displayName: 'Previously Filed Reports',
    routerLink: ['/filing/ethics_report']
  },
  ]

  ethicFormRequest = [
    {
      displayName: 'Request Access to Ethics Form',
      routerLink: []
    }
  ]

  constructor(
    private commonMethods: CommonMethods,
  ) { }

  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }


}
