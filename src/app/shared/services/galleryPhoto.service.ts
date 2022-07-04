import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from 'src/app/shared/image.interface';

@Injectable({
    providedIn: 'root',
})

export class PhotoService {

    constructor(private http: HttpClient) { }

    getImages() {
        Image
    return this.http.get<any>('assets/photos/info.json')
      .toPromise()
      .then(res => <Image[]>res.data)
      .then(data => { return data; });
    }
}