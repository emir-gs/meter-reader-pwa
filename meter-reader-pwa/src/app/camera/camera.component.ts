import { DatabaseService } from './../services/database.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  showCapture = false;
  isPhotoShot = false;
  isPhotoUploaded = false;

  private constraints = {
    video: {
        facingMode: 'environment',
        width: { ideal: 4096 },
        height: { ideal: 2160 }
    }
  };

  videoWidth = 0;
  videoHeight = 0;

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  constructor(private renderer: Renderer2, private db: DatabaseService) { }

  isCameraAvailable = false;

  ngOnInit() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      this.isCameraAvailable = true;
    }
  }

  startCamera() {
    this.showCapture = false;
    document.getElementById('video').style.visibility = 'visible';

    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
  navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
        alert('Sorry, camera not available.');
    }

  }

  stopCamera() {
    this.showCapture = true;
    const video = document.getElementById('video') as HTMLVideoElement;
    const stream = video.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    video.style.visibility = 'hidden';
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
  });
  }

  capture() {
    this.showCapture = true;
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.isPhotoShot = true;
  }

  fileUploaded() {
    this.isPhotoUploaded = true;
  }

  getUploadedFile(): File {
    const elem = document.getElementById('photoUpload') as HTMLInputElement;
    return elem.files[0];
  }
}
