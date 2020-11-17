import { DatabaseService } from './../services/database.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup , FormBuilder, Validators, FormGroupDirective} from '@angular/forms';
import {  MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  readerForm: FormGroup;
  meter;
  showMeterForm = false;
  showSecondCount = false;

  constructor(private databaseService: DatabaseService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {

    //initialize the reader Form
    this.readerForm = this.formBuilder.group({
      meter: ['', Validators.required],
      count: ['', [Validators.required, Validators.min(0), Validators.max(999999),  Validators.pattern('^[0-9]*$')]],
      secondCount: ['', [Validators.min(0), Validators.max(999999),  Validators.pattern('^[0-9]*$')]],
    });

    //get all meters
    this.databaseService.getAllMeters().subscribe(data => {
      this.meter = data;
    }, err => console.error(err));
  }

  onSubmitReaderForm(formDirective: FormGroupDirective) {

    const meter = this.readerForm.controls.meter.value;  // get current selected meter

    let newReads = meter.payload.doc.data().reads;  // copy the existing reads
    if (meter.payload.doc.data().reads === undefined) {newReads = []; } //initialize Array in order to prevent errors

    const dateStamp = new Date();

    if (meter.payload.doc.data().isDoubleTariffMeter === true) {
      newReads.push(
        {
          count: this.readerForm.controls.count.value,
          secondCount: this.readerForm.controls.secondCount.value,
          date: dateStamp.toISOString()
        });
    } else {
      newReads.push({
        count: this.readerForm.controls.count.value,
        date: dateStamp.toISOString()
      });
    }

    this.databaseService.
      updateReads(meter, {reads: newReads} ).catch(err => console.error(err));

    formDirective.resetForm();
    this.readerForm.reset();
    this.snackBar.open('Zählerstand wurde erfasst', 'Ok', {duration: 2000});

  }

  checkToShowSecondCount() {
    const meter = this.readerForm.controls.meter.value;

    if (!meter.payload.doc.data().isDoubleTariffMeter) {
      this.showSecondCount = false;
    } else {
      this.showSecondCount = true;
    }

  }
}
