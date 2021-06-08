import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EthicFormRequestComponent } from './ethic-form-request/ethic-form-request.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: "requestAccess",
        component: EthicFormRequestComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EthicFormRequestRoutingModule { }
