import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { FilingPeriodComponent } from './filing-period/filing-period.component';
import { ElectionCycleComponent } from './election-cycle/election-cycle.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
@NgModule({
  declarations: [ElectionCycleComponent, FilingPeriodComponent, EventCalendarComponent, CalendarListComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaterialTimepickerModule,
  ],
})
export class CalendarModule { }
