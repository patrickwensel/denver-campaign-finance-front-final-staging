import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { LocalstorageService, MasterDataService } from 'src/app/core';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss']
})
export class CalendarListComponent implements OnInit {
  listItems: any;
  filing:boolean = false;
  election:boolean = false;
  event:boolean = false;
 // ref: https://stackoverflow.com/questions/44053227/how-to-emit-an-event-from-parent-to-child
 eventsCalenderToChange: Subject<void> = new Subject<void>();
  user_type: string;
  isadmin: boolean = false;
 constructor(
  private localStore: LocalstorageService,
  public masterDate: MasterDataService,

 ) { }
 // For calender Refresh Event
 onSaveChange() {
   this.eventsCalenderToChange.next();
 }
  ngOnInit(): void {
    // this.user_type = this.localStore.getLocalStorage(this.masterDate.user_Type);
    this.user_type = this.localStore.getLocalStorage('user_type');
    if (this.user_type == 'Admin') {
      this.isadmin = true;
    } else {
      this.isadmin = false;
    }
    this.listItems = this.candidateLabels
  }
  candidateLabels = [ {
    displayName: 'Filing Period',
  },
  {
    displayName: 'Election Cycle',
  },
  {
    displayName: 'Event',
  } ]

  view(i){
 if(i.displayName == "Filing Period"){
  this.filing = !this.filing
 }else if(i.displayName == "Election Cycle"){
  this.election = !this.election
 }else{
  this.event = !this.event
 }
  }
}
