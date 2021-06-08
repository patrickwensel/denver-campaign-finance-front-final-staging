import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonMethods, SnackbarService } from "src/app/core";
import { CreateAccountService } from "src/app/core/services/create-account.service";
import { FileShareService } from "src/app/core/services/file-share.service";

@Component({
  selector: "app-modify",
  templateUrl: "./modify.component.html",
  styleUrls: ["./modify.component.scss"],
})
export class ModifyComponent implements OnInit {
  @Input() modifyLabels: any;
  @Input() getmodifyForm: any;
  @Output() imageIndex: EventEmitter<any> = new EventEmitter<any>();
  modifyItems: any[];
  imageArray = [];
  static_data: any;
  imageBase64: string | ArrayBuffer;
  modifyData: any[];
  name: any;
  constructor(
    private commonMethods: CommonMethods,
    public file:FileShareService,
    public snackbar: SnackbarService,
    public signIn: CreateAccountService

  ) {}

  ngOnInit(): void {
    this.getModifyItems();
    this.commonMethods.setCurrentLanguage();
    this.static_data = this.commonMethods.getCurrentLanguage();
  }
  // getModifyItem(){
  //   this.modifyData = [];
  //   this.modifyData = this.getmodifyForm;
  //   console.log(this.modifyData)
  // }
  getModifyItems() {
    let labelarray: any;
    this.modifyItems = [];
    for(let item of this.modifyLabels){
      if(item.imageSource == "string"){
        item.imageSource = null
      }
    }
    this.modifyItems = this.modifyLabels;
  }
  selectImage(e, index) {
    const file = e.target.files[0];
    this.name = e.target.files[0].name;
    if (e.target.files[0].size > 2097152){
      return this.snackbar.snackbarError("Should not exceed more than 2mb", "center");
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageBase64 = reader.result;
      this.modifyItems[index].imageSource = this.imageBase64;
      this.imageArray[index] = this.imageBase64;
    };
  }
  removeImage(index){
    this.modifyItems[index].imageSource = null;
    // this.imageArray.splice(index, 1)
    this.imageArray[index] = null;
   }
  save(){
    this.imageIndex.emit(this.imageArray);
  }
}
