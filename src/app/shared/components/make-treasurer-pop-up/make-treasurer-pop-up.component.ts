import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalstorageService, CommonMethods, MasterDataService, MasterUrlService, ErrorMessageService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';
@Component({
  selector: 'app-make-treasurer-pop-up',
  templateUrl: './make-treasurer-pop-up.component.html',
  styleUrls: ['./make-treasurer-pop-up.component.scss']
})
export class MakeTreasurerPopUpComponent implements OnInit {
  static_data: any = {};

  constructor(
    public dialogRef: MatDialogRef<MakeTreasurerPopUpComponent>,
    private localStore: LocalstorageService,
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    private urlService: MasterUrlService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  onNoClick(): void {
    this.dialogRef.close('close');
  }
}
