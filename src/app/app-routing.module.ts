import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Authguard, LoginAuthguard } from './core/index';

//Component
import { LoginLayoutComponent } from './shared/components/login-layout/login-layout.component';
import { HomeLayoutComponent } from './shared/components/home-layout/home-layout.component';
import { CommitteeHomeLayoutComponent } from './shared/components/committee-home-layout/committee-home-layout.component';
const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    canActivate: [LoginAuthguard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path:'', loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule),
      }
    ]
    // loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule),
  },
  {
    path: "lobbyist",
    component: CommitteeHomeLayoutComponent,
    // canActivate: [Authguard],
    loadChildren: () => import("./modules/Lobbyist/lobbyist.module").then(m => m.LobbyistModule)
  },
  {
    path: 'profile',
    component: HomeLayoutComponent,
    // canActivate: [Authguard],
    loadChildren: () => import("./modules/Profile/profile.module").then(m => m.ProfileModule)
  },
  {
    path: 'ethics',
    component: HomeLayoutComponent,
    // canActivate: [Authguard],
    loadChildren: () => import("./modules/ethic-form-request/ethic-form-request.module").then(m => m.EthicFormRequestModule)
  },
  {
    path: "committee",
    component: CommitteeHomeLayoutComponent,
    // canActivate: [Authguard],
    loadChildren: () => import("./modules/Committee/committee.module").then(m=>m.CommitteeModule)
  },
  {
    path: "switch",
    component: HomeLayoutComponent,
    canActivate: [Authguard],
    loadChildren: () => import("./modules/switch-committee/switch-committee.module").then(m=>m.SwitchCommitteeModule)
  },
  {
    path: "dashboard",
    component: HomeLayoutComponent,
    // canActivate: [Authguard],
    loadChildren: () => import("./modules/Dashboard/dashboard.module").then(m=>m.DashboardModule)
  },
  {
    path: "system",
    component: HomeLayoutComponent,

    loadChildren: () => import("./modules/System-Management/system-management.module").then(m=>m.SystemManagementModule)
  },
{
  path:"manage",
  component: HomeLayoutComponent,
  loadChildren:() => import("./modules/Manage-Committee/manage-committee.module").then(m => m.ManageCommitteeModule)
},
{
  path:"calendar",
  component: HomeLayoutComponent,
  loadChildren:() => import("./modules/calendar/calendar.module").then(m => m.CalendarModule)
},

{
  path:"filing",
  component: HomeLayoutComponent,
  loadChildren:() => import("./modules/Filing/filing.module").then(m => m.FilingModule)
},

{
  path:"Public",
  component: HomeLayoutComponent,
  loadChildren:() => import("./modules/public/public.module").then(m => m.PublicModule)
},

{ 
  path: 'help', 
  component: HomeLayoutComponent,
  loadChildren:() => import("./modules/helps/helps.module").then(m => m.HelpsModule)
   
},
{ 
  path: 'committee-info-dashboard', 
  component: HomeLayoutComponent,
  loadChildren:() => import("./modules/committee-information/committee-information.module").then(m => m.CommitteeInformationModule)
   
},

{ 
  path: 'fine-and-fees', 
  component: HomeLayoutComponent,
  loadChildren:() => import("./modules/fine-and-fees-dashboard/fine-and-fees-dashboard.module").then(m => m.FineAndFeesDashboardModule)
   
},


{
  path:"candidate",
  component: HomeLayoutComponent,
  loadChildren:() => import("./modules/candidate/candidate.module").then(m => m.CandidateModule)
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
