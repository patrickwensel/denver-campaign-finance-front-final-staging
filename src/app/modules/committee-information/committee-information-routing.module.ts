import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommitteeInformationDashboardComponent } from './committee-information-dashboard/committee-information-dashboard.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { AdminManageUserComponent } from './admin-manage-user/admin-manage-user.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "",
        component: CommitteeInformationDashboardComponent
      },
      {
        path: "manage-user",
        component: ManageUserComponent
      },
      {
        path: "admin-manage-user",
        component: AdminManageUserComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteeInformationRoutingModule { }
