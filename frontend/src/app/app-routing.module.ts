import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamAnalysisComponent } from './team-analysis/team-analysis.component';

const routes: Routes = [{ path: 'team/analysis', component: TeamAnalysisComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
