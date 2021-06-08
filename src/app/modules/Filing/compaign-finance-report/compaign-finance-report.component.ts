import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonMethods, MasterDataService, MasterUrlService, ErrorMessageService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-compaign-finance-report',
  templateUrl: './compaign-finance-report.component.html',
  styleUrls: ['./compaign-finance-report.component.scss'],
   animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class CompaignFinanceReportComponent implements OnInit {
  name = "Jon Rios for City Council";
  static_data: any;
  hideRequiredMarker: boolean = true;
  showMonetary = true;
  showMatching = true;
  showFEF = true;
  showKind = true;
  showRefund = true;
  showExpenditure = true;
  showLoans = true;
  // inkind = "inkind"
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
    private fb: FormBuilder,
    private service: ClientService,
    public router: Router,
    public snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.existingReports.data = [
      {
        filing: "hari",
        reporting: "56",
        amendment: "56",
        submit:"hari",
      },
    ];
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  existingReports = new MatTableDataSource();
  fairElection = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = ["filing", "reporting", "amendment","submit", "toggle", "view"];
  election: string[] = ["date", "amount", "contribution"];
}
