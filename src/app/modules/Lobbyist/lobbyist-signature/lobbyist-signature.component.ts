import { Component, ElementRef, OnInit, Output,EventEmitter, TemplateRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonMethods, ErrorMessageService, MasterDataService, MasterUrlService, SnackbarService } from 'src/app/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as SignaturePadNative from 'signature_pad';
import { ClientService } from 'src/app/core/api-services/client.service';
import { SigninService } from 'src/app/core/services/formbackup.service';

@Component({
  selector: 'app-lobbyist-signature',
  templateUrl: './lobbyist-signature.component.html',
  styleUrls: ['./lobbyist-signature.component.scss']
})
export class LobbyistSignatureComponent implements OnInit {
  @Input() LobbyRegistrationDate:any = {}
  @Output() backBtnEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() signaturePadEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() signatureEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('addDocTemp', { static: true }) addDocTemplate: TemplateRef<any>;
  hideRequiredMarker: boolean = true;
  static_data: any;
  LobbySignatureForm: FormGroup;
  addDocForm: FormGroup;

  public signaturePad: any='';
  public elementRef: ElementRef;
  options: any = { dotSize: 1, minWidth: 1000, minDistance: 0, canvasHeight: 300, canvasWidth: 1000 };
  fileName: any;
  hasError: boolean;
  modalRef: BsModalRef<Object>;
  modalOpen: boolean;
  base64textString: string;


  constructor(public commonMethods: CommonMethods,
    public masterData: MasterDataService,
    public snackbar: SnackbarService,
    public service: ClientService,
    public urlService: MasterUrlService,
    private backupform: SigninService,
    public errorService: ErrorMessageService, elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private modalService: BsModalService) {
    this.elementRef = elementRef;
    this.options = this.options || { dotSize: 1, minWidth: 1000, minDistance: 0, canvasHeight: 300, canvasWidth: 1000 };
  }


  ngOnInit(): void {
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
    this.LobbySignature();
    this.initAddSignForm();
  }

  initAddSignForm() {
    this.addDocForm = this.formBuilder.group({
      File: ['', Validators.required],
    })
  }

  setAddDocForm(docDetails: any = {}) {
    this.hasError = false;
    this.fileName = '';
    this.addDocForm = this.formBuilder.group({
      File: ['', Validators.required],
    });
  }

  addDocModal(template: TemplateRef<any>) {
    this.setAddDocForm();
    this.modalRef = this.modalService.show(template, {
      class: 'small-modal',
      ignoreBackdropClick: true
    });
    this.modalOpen = true;
  }

  createModel(): any {
    const input = new FormData();
    input.append('File', this.addDocForm.get('File').value);
    return input;
  }

  remove() {
    this.base64textString = '';

  }
  uploadDoc() {

    if (!this.base64textString) {
      return this.snackbar.snackbarError("Please upload your signature image(png/jpeg)", this.masterData.centre);
    }
    this.modalRef.hide();
    return this.snackbar.snackbarSuccess("Signature uploaded Successfully");
  }


  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let allowedExtensions = this.masterData.associatedDocAllowedFileTypes;
      let ext = file.name.split('.').pop().toLowerCase();
      if (allowedExtensions.indexOf(ext) === -1) {
        this.snackbar.snackbarError(this.masterData.associatedDocValidationMsg, 'center');
        this.remove();
        return;
      }
      // const file = event.target.files[0];
      this.handleFileSelect(event)
      this.addDocForm.get('File').setValue(file);
      this.fileName = file.name;
    }
  }

  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }



  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }

  dataURLtoFile(dataurl: string, filename: string) {

    let arr: any = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }



  public ngAfterContentInit(): void {
    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    if ((this.options as any).canvasHeight) {
      canvas.height = (this.options as any).canvasHeight;
    }

    if ((this.options as any).canvasWidth) {
      canvas.width = (this.options as any).canvasWidth;
    }

    this.signaturePad = new SignaturePadNative.default(canvas, this.options);
    // this.signaturePad.onBegin = this.onBegin.bind(this);
    // this.signaturePad.onEnd = this.onEnd.bind(this);
  }

  savePng() {
    if (this.signaturePad.isEmpty()) {
      return alert("Please provide a signature first.");
    }

    var base64content = this.signaturePad.toDataURL('image/png');
    //Usage example:
    let file = this.dataURLtoFile(base64content, 'hello.png');
    // return;
    // console.log(data);
    // window.open(data);

    // const blobData = this.convertBase64ToBlobData(this.signaturePad);


    // if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
    //   window.navigator.msSaveOrOpenBlob(base64content, 'signature');
    // } else { // chrome
    //   const blob = new Blob([base64content],{type:"image/png"});
    //   const url = window.URL.createObjectURL(blob);
    //   // window.open(url);
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = 'signature';
    //   link.click();
    // }
    // }
  }

  clear() {
    this.signaturePad.clear();
  }

  convertBase64ToBlobData(base64Data: string, contentType: string = 'image/png', sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  setData(){
    if(this.backupform.data.firstName !== ""){
        this.LobbySignatureForm.patchValue({
          firstName: this.backupform.data.firstName,
          lastName: this.backupform.data.lastName,
          email:this.backupform.data.email
        })
    }
  }

  LobbySignature() {
    this.LobbySignatureForm = new FormGroup({
      firstName: new FormControl("" || null,
        [Validators.minLength(2), Validators.maxLength(80), Validators.pattern(this.masterData.onlyAlpha)]),
      lastName: new FormControl("" || null,
        [Validators.minLength(2), Validators.maxLength(80), Validators.pattern(this.masterData.onlyAlpha)]),
      email: new FormControl("" || null,
        [Validators.maxLength(120),Validators.pattern(this.masterData.emailValidations)])
    });
    this.setData();
  }


  // Submit Lobby
  submitLobbiestDetail() {
    if (this.LobbySignatureForm.valid) {
      if (this.signaturePad.isEmpty() && !this.base64textString) {
        return this.snackbar.snackbarError("Signature is required", this.masterData.centre)
      }
      // this.signatureEmitter.emit(this.LobbySignatureForm.value)
      // this.signaturePadEmitter.emit(this.base64textString?this.base64textString:this.signaturePad.toDataURL('image/png'));
      this.saveSignatureData()
      }
      else{
        this.LobbySignatureForm.markAllAsTouched();
      }
      this.backupform.resetData();
      // console.log(this.backupform.data)
    }

    saveSignatureData() {
      let data = {
        "lobbyistId": this.LobbyRegistrationDate.lobbyistID,
        "signFirstName": this.LobbySignatureForm.value.firstName,
        "signLastName":this.LobbySignatureForm.value.lastName,
        "signEmail": this.LobbySignatureForm.value.email,
        "signImageURL": this.base64textString?this.base64textString:this.signaturePad.toDataURL('image/png')
      }

      this.service.putData(this.urlService.saveSignature,data).subscribe((res:any) => {
        this.snackbar.snackbarSuccess("Signature save successfully");
        this.signaturePadEmitter.emit(this.base64textString?this.base64textString:this.signaturePad.toDataURL('image/png'));
      },err =>{
        console.log(err);
        this.snackbar.snackbarError("Unexpected server error", this.masterData.centre);
      })
    }


      // let { firstName, lastName, email } = this.LobbySignatureForm.value;
      // let signatureInfo = {
      //   firstName,
      //   lastName,
      //   email,
      //   signature: this.signaturePad.toDataURL('image/png')

      //Need to change URL
  //     this.service.postData(this.urlService.committeeInformation, signatureInfo).subscribe((res: any) => {
  //       this.snackbar.snackbarSuccess("Lobbyist Information Updated Succesfully");
  //     }, err => {
  //       this.snackbar.snackbarError(this.masterData.errorMsg, this.masterData.centre);
  //     })
  //   }
  //   else {
  //     this.LobbySignatureForm.markAllAsTouched();
  //   }
  // }
  goBack(){
    if(this.LobbySignatureForm.value) {
      this.backupform.data.firstName = (this.LobbySignatureForm.get('firstName').value)
      this.backupform.data.lastName = (this.LobbySignatureForm.get('lastName').value)
      this.backupform.data.email = (this.LobbySignatureForm.get('email').value)
    }
    this.backBtnEmitter.emit(5)
  }

}
