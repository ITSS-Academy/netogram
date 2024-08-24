import { Injectable } from '@angular/core';
import {HttpClientAuth} from "../../util/http-client-auth";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private httpClient: HttpClientAuth) {}

  uploadFile(file: File, fileName: string) {
    const formData = new FormData();
    formData.delete('files');
    formData.append('imageUrl', file);
    formData.append('folderName', fileName);
    return this.httpClient.post(`storage/upload`, formData);
  }

  uploadFileCover(file: File, fileName: string) {
    const formData = new FormData();
    formData.delete('files');
    formData.append('imageUrl', file);
    formData.append('folderName', fileName);
    return this.httpClient.post(`storage/upload/cover`, formData);
  }
}
