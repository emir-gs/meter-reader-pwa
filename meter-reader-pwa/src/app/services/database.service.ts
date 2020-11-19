import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor( private firestore: AngularFirestore, private storage: AngularFireStorage) {}

createMeter(meter) {
  return this.firestore.collection('meters').add(meter);
}

getAllMeters() {
  return this.firestore.collection('meters').snapshotChanges();
}

updateMeter(data, value) {
  return this.firestore.collection('meters').doc(data.payload.doc.id).set(value);
}

updateReads(meter, value) {
  return this.firestore.collection('meters').doc(meter.payload.doc.id).set(value, {merge: true});
}

delete(data) {
   return this.firestore.collection('meters').doc(data.payload.doc.id).delete();
}

saveId(id: string) {
  const subsRef = this.firestore.firestore.collection('subs');
  subsRef.where('id', '==', id).get().then(data => {
    //only add to subscription list if id is not already in there
    if (data.empty) {
      subsRef.add({id});
    }
  });
}

saveImage(blob: Blob, meterName: string) {
  const dateStamp = new Date().toISOString();
  const filePath = meterName + '/' + dateStamp;
  this.storage.upload(filePath, blob).then(data => console.log, err => console.log(err));
}

}
