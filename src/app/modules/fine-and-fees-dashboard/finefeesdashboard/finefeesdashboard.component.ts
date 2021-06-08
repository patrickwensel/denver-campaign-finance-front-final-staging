import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-finefeesdashboard',
  templateUrl: './finefeesdashboard.component.html',
  styleUrls: ['./finefeesdashboard.component.scss']
})
export class FinefeesdashboardComponent implements OnInit {

  constructor() { }

  labels = [{
    displayName: 'Fines and Fees Management',
    routerLink: ["/fine-and-fees/latefine"]
  },
  {
    displayName: 'Payments and Waivers',
    routerLink: ['/fine-and-fees/payments']
  }
  ]


  ngOnInit(): void {
  }


  
}
