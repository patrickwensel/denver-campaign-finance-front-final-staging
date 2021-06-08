import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { ElectionCycleComponent } from './election-cycle/election-cycle.component';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { FilingPeriodComponent } from './filing-period/filing-period.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "election-cycle",
        component: ElectionCycleComponent
      },
      {
        path: "filing-Period", 
        component: FilingPeriodComponent
      },
      {
        path: "event",
        component: EventCalendarComponent
      },
      {
        path: "calendar",
        component: CalendarListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
