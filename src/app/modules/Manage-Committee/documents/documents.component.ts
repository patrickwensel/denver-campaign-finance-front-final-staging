import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from "@angular/common";


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  docaddform: FormGroup;

  constructor(
    private fb: FormBuilder,
    private location: Location,

  ) { }

  ngOnInit(): void {
    this.initform();
  }

  initform(){
    this.docaddform = this.fb.group({
      category: [],
      submittedby: [],
    })
  }

  back(){
    this.location.back();
  }
}
