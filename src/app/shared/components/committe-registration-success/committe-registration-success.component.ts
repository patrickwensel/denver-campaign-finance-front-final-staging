import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonMethods, MasterDataService, ErrorMessageService, LocalstorageService } from 'src/app/core';

@Component({
  selector: 'app-committe-registration-success',
  templateUrl: './committe-registration-success.component.html',
  styleUrls: ['./committe-registration-success.component.scss']
})
export class CommitteRegistrationSuccessComponent implements OnInit {
  @Input() email: any;
  static_data: any = {};
  session: any;
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    public router: Router,
    private localStore: LocalstorageService,
  ) { }

  ngOnInit(): void {
    this.session = this.localStore.getLocalStorage('email');
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }

  goToLogin(){
    this.router.navigate(['login'])
  }

  downloadFile(file_url: any){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', file_url);
    link.setAttribute('download', `products.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

}
