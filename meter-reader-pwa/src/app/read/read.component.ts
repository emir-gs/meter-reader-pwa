import { DatabaseService } from './../services/database.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup , FormBuilder, Validators, FormGroupDirective} from '@angular/forms';
import {  MatSnackBar } from '@angular/material';
import { CameraComponent } from '../camera/camera.component';


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
  @ViewChild(CameraComponent, {static: false}) cameraComponent: CameraComponent;

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

    if (this.cameraComponent.isPhotoShot) {
      this.saveImageShot(meter.payload.doc.data().name);
    } else {
      if (this.cameraComponent.isPhotoUploaded) {
        this.saveImageLoaded(meter.payload.doc.data().name);
      }
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

  saveImageShot(name: string) {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.toBlob(blob => this.databaseService.saveImage(blob, name));
  }

  saveImageLoaded(name: string) {
    this.databaseService.saveImage(this.cameraComponent.getUploadedFile(), name);
  }
}
