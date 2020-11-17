import { Meter } from './../models/meter.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor( private firestore: AngularFirestore) {}

createMeter(meter: Meter) {
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

deleteAll() {
  this.getAllMeters().subscribe(data => {
    data.forEach(doc => {
      this.delete(doc);
    });
  });
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

}
