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

    if (meter.payload.doc.data().isDoubleTariffMeter === false) {
      if (meter.payload.doc.data().reads.length === 0
          || meter.payload.doc.data().reads[meter.payload.doc.data().reads.length - 1].count <= this.readerForm.controls.count.value) {
        this.databaseService.
        updateReads(meter, {reads: newReads} ).then(() => {
          console.log('saved');
          this.snackBar.open('Neuer Zählerstand wurde erfasst', 'OK', {duration: 4000});
        }).catch(err => console.error(err));
      } else {
         this.snackBar.open('Der neue Zählerstand muss über den alten Wert liegen',
         meter.payload.doc.data().reads[meter.payload.doc.data().reads.length - 1].count, {duration: 6000});
      }
    } else {
      if ( meter.payload.doc.data().reads.length === 0
          || meter.payload.doc.data().reads[meter.payload.doc.data().reads.length - 1].count <= this.readerForm.controls.count.value
          && meter.payload.doc.data().reads[meter.payload.doc.data().reads.length - 1].secondCount <= this.readerForm.controls.secondCount.value) {
        this.databaseService.
        updateReads(meter, {reads: newReads} ).then(() => {
          console.log('saved');
          this.snackBar.open('Neue Zählerstande wurden erfasst', 'OK', {duration: 4000});
        }).catch(err => console.error(err));
      } else {
        this.snackBar.open('Die neuen Zählerstände müssen über den alten Werten liegen',
        meter.payload.doc.data().reads[meter.payload.doc.data().reads.length - 1].count + '  und  '
        + meter.payload.doc.data().reads[meter.payload.doc.data().reads.length - 1].secondCount, {duration: 6000});
      }
    }

    if (this.cameraComponent.isPhotoShot) {
      this.saveImageShot(meter.payload.doc.data().name);
    } else {
      if (this.cameraComponent.isPhotoUploaded) {
        this.saveImageLoaded(meter.payload.doc.data().name);
      }
    }

    formDirective.resetForm();
    this.readerForm.reset();
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
