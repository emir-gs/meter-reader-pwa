import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { ManageCounterComponent } from './manage-counter/manage-counter.component';
import { ReadComponent } from './read/read.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'read',
    component: ReadComponent
  },
  {
    path: 'manage-counter',
    component: ManageCounterComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: '*',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
