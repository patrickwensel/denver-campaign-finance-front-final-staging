import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidatedashboardComponent } from './candidatedashboard/candidatedashboard.component';
import { LobbydashboardComponent } from './lobbydashboard/lobbydashboard.component';
import { CoveredOfficialDashboardComponent } from './covered-official-dashboard/covered-official-dashboard.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "candidate",
        component: CandidatedashboardComponent
      },
      {
        path: "lobby",
        component: LobbydashboardComponent
      },
      {
        path: "coveredOfficial",
        component: CoveredOfficialDashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
