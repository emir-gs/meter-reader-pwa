import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Meter } from '../models/meter.model';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-manage-counter',
  templateUrl: './manage-counter.component.html',
  styleUrls: ['./manage-counter.component.css']
})
export class ManageCounterComponent implements OnInit {
  @ViewChild('selected', { static: true }) selectedMeters: ElementRef;

  meterForm: FormGroup;
  meter;
  displayedColumns: string[] = ['name', 'action'];

  selectedRows = [];

  constructor(private databaseService: DatabaseService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.meter = [];
    this.meterForm = this.formBuilder.group({
      name: ['', Validators.required],
      meterType: [1, Validators.required],
    });

    this.databaseService.getAllMeters().subscribe(data => {
      this.meter = data;
    });
  }

  onSubmitMeterForm(formDirective: FormGroupDirective) {
    let isDoubleTariffMeter = false;
    if (this.meterForm.controls.meterType.value === '2') {
      isDoubleTariffMeter = true;
    }
    this.databaseService.createMeter({name: this.meterForm.controls.name.value, isDoubleTariffMeter, reads: []});
    formDirective.resetForm();
    this.meterForm.reset();
  }

  deleteMeter(meter: Meter) {
    this.databaseService.delete(meter);
  }
}
