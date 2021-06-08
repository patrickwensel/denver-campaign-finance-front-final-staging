import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonMethods, MasterDataService, MasterUrlService, ErrorMessageService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-search-contacts',
  templateUrl: './search-contacts.component.html',
  styleUrls: ['./search-contacts.component.scss']
})
export class SearchContactsComponent implements OnInit {
  name = "Jon Rios for City Council";
  static_data: any;
  typeID:any;
  hideRequiredMarker: boolean = true;
  searchpopular:any;
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
    this.dataMatchingList.data = [
      {
        name: "hari",
        role: "56",
        employer: "56",
        occupation:"hari",
        city:"cbe",
        state:"tn",
        zip:"cbe",
        type:"tn"
      },
    ];
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  dataMatchingList = new MatTableDataSource();
  displayedStudentsColumnsList: string[] = ["name", "role", "employer","occupation", "city", "state","zip","type","action"];

}
