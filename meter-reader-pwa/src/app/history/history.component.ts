import { Component, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  meter;
  displayedColumns: string[] = ['count', 'secondCount', 'date'];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
   this.databaseService.getAllMeters().subscribe(data => {
    this.meter = data;
  });
  }
}
