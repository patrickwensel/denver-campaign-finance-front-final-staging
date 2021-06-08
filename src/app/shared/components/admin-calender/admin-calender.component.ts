import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  Input
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Observable, Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { CommonMethods, MasterDataService, ErrorMessageService, MasterUrlService, SnackbarService, LocalstorageService } from 'src/app/core';
import { ClientService } from 'src/app/core/api-services/client.service';

const colors: any = {
  red: {
    primary: '#c4161c',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#045898',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#f4901d',
    secondary: '#FDF1BA',
  },
};



@Component({
  selector: 'app-admin-calender',
  templateUrl: './admin-calender.component.html',
  styleUrls: ['./admin-calender.component.scss']
})
export class AdminCalenderComponent implements OnInit {
  legends: any = [
    {
      name:"Campaign Committees",
      primary: '#c4161c',
      secondary: '#c4161c',
    },
    {
      name:"Independent Expenditure Filers",
      primary: '#f4901d',
      secondary: '#f4901d',
    },
    {
      name:"Lobbiests",
      primary: '#045898',
      secondary: '#045898',
    },
    {
      name:"Ethics Filers",
      primary: '#3ca324',
      secondary: '#FDF1BA',
    },
    {
      name:"More than One Filer Type",
      primary: '#0297d6',
      secondary: '#FDF1BA',
    },
  ];
  calendarDataList: any = {};
  fillerTypes: any = [];
  selectedFilerType = 'all';
  year: number;
  month: string;
  @Input() eventsChange: Observable<any>;
  eventsSubscription: any;
  filerType: any;
  fil: any[];
  constructor(
    private commonMethods: CommonMethods,
    public masterDate: MasterDataService,
    public errorService: ErrorMessageService,
    private service: ClientService,
    private urlService: MasterUrlService,
    public snackbar: SnackbarService,
    private localStore: LocalstorageService,
    public route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.eventsSubscription = this.eventsChange.subscribe(() => this.getInit());
    this.getInit();
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getInit() {
    this.setYearMonth();
    this.getAllFillerType();
    this.getCalendarEventDetail();
  }

  getAllFillerType() {
    let lookUpTypeCode = "COM";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode).subscribe((res: any) => {
        // this.snackbar.snackbarSuccess("Lobbyist Information Updated Succesfully");
        this.fillerTypes = res;
        this.getFilerType();
      }, (err) => {
        this.snackbar.snackbarError("Issue while get Filter Type", this.masterDate.centre);
      })
  }
  getFilerType() {
    let lookUpTypeCode = "FIL-TYPE";
    this.service
      .getData(this.urlService.getLookUpTypeList + lookUpTypeCode)
      .subscribe((res: any) => {
        this.filerType = res;
        this.fil = [...this.fillerTypes, ...this.filerType]
        console.log(this.fil)
      });
  }
  getCalendarEventDetail() {
    this.service.getData(`${this.urlService.getCalendarList}filerType=${this.selectedFilerType}&month=${this.month}&year=${this.year}`).subscribe((res: any) => {
      // this.snackbar.snackbarSuccess("Lobbyist Information Updated Succesfully");
      this.calendarDataList = res;
      this.setDateEventtoCalendar();
    }, (err) => {
      this.snackbar.snackbarError("Issue while getting calender list", this.masterDate.centre);
    })
  }

  setDateEventtoCalendar() {
    let obj = ['electionCycleDetails', 'eventDetails', 'filingPeriodDetails'];
    this.events = [];
    obj.forEach((e, i) => {
      if (this.calendarDataList[e] && this.calendarDataList[e].length) {
        this.calendarDataList[e].forEach(calander => {
          if (this.isAnyEventToday(`${calander.eDate}Z`)) {
            this.activeDayIsOpen = true;
          }
          this.events.push({
            start: startOfDay(new Date(`${calander.eDate}Z`)),
            title: calander.title,
            color: (i == 0) ? colors.red : (i == 1) ? colors.yellow : colors.blue,
            actions: this.actions,
          })
        })
      }
    })
  }

  onChangeFiler(filerType: any) {
    this.selectedFilerType = filerType;
    this.getCalendarEventDetail();
  }

  // @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  // [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     // resizable: {
  //     //   beforeStart: true,
  //     //   afterEnd: true,
  //     // },
  //     // draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     // resizable: {
  //     //   beforeStart: true,
  //     //   afterEnd: true,
  //     // },
  //     // draggable: true,
  //   },
  // ];

  activeDayIsOpen: boolean = false;

  // constructor(private modal: NgbModal) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    debugger;
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        // draggable: true,
        // resizable: {
        //   beforeStart: true,
        //   afterEnd: true,
        // },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  // Not Needed For Now
  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.setYearMonth();

  }

  setYearMonth() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let currentDate = this.viewDate ? new Date(this.viewDate) : new Date();
    this.year = currentDate.getFullYear();
    this.month = monthNames[currentDate.getMonth()];

    this.getCalendarEventDetail();
  }

  isToday(date: any) {
    if (!date) return false;
    let cdate = new Date(date);
    let today = new Date();
    let cday = cdate.getDate(), cmonth = cdate.getMonth(), cyear = cdate.getFullYear();
    let tday = today.getDate(), tmonth = today.getMonth(), tyear = today.getFullYear();
    return (cday == tday && cmonth == tmonth && cyear == tyear);
  }

  isAnyEventToday(date: any) {
    if (!date) return false;
    let cdate = new Date(date);
    let today = new Date();
    let cday = cdate.getDate(), cmonth = cdate.getMonth(), cyear = cdate.getFullYear();
    let tday = today.getDate(), tmonth = today.getMonth(), tyear = today.getFullYear();
    return (cday == tday && cmonth == tmonth && cyear == tyear);
  }

}
