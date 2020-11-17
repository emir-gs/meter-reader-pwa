import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
