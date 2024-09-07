import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) {}

  uploadImage(folder: string, file: File): Observable<string> {
    const filePath = `${folder}/${new Date().getTime()}_${file.name}`;
    const uploadTask = this.storage.upload(filePath, file);
    return new Observable(observer => {
      uploadTask.then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          observer.next(url);
          observer.complete();
        });
      });
    });
  }

}
