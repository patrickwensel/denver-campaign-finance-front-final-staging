import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonMethods, MasterDataService, MasterUrlService, ErrorMessageService, SnackbarService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent implements OnInit {
  name = "Jon Rios for City Council";
  static_data: any;
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
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }

}
