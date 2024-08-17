import { HttpErrorResponseModel } from '../../models/http-error-response.model';
import { StorageModel } from '../../models/storage.model';

export interface StorageState {
  url: string[];
  storage: StorageModel;
  isUploading: boolean;
  uploadError: HttpErrorResponseModel;
}