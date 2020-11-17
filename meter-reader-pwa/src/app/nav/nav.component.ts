import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ConnectionService } from '../services/connection.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  online = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private snackBar: MatSnackBar, private connection: ConnectionService) {}

  ngOnInit() {
    this.connection.start();
    this.connection.behaviorSubjectObservable$.subscribe(online => {
      this.online = online;
      if (!this.online) {
        this.snackBar.open('You are offline!', '', { duration: 3000 });
      } else {
        this.snackBar.dismiss();
      }
    });
  }
}
