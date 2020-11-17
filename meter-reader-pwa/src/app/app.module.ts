import { HistoryComponent } from './history/history.component';
import { ManageCounterComponent } from './manage-counter/manage-counter.component';
import { ReadComponent } from './read/read.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';

import { environment } from './../environments/environment.prod';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatTableModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    ReadComponent,
    ManageCounterComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebaseConfig, 'PWA'),
    AngularFirestoreModule.enablePersistence(),

    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
