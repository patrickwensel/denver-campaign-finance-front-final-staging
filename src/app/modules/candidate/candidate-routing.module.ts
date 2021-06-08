import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';

const routes: Routes = [
    {
      path:"", component: CandidateDetailsComponent
    },
]; 

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CandidateRoutingModule { }
  