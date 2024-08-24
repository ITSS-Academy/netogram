import { createAction, props } from '@ngrx/store';
import { HttpErrorResponseModel } from '../../models/http-error-response.model';

export const uploadFile = createAction(
  '[Storage] Upload File',
  props<{ file: File; fileName: string }>(),
);

export const uploadFileFailure = createAction(
  '[Storage] Upload File Failure',
  props<{ uploadFileErrorMessage: HttpErrorResponseModel }>(),
);

export const uploadFileSuccess = createAction(
  '[Storage] Upload File Success',
  props<{ url: string[] }>(),
);

export const uploadFileCover = createAction(
  '[Storage] Upload File Cover',
  props<{ file: File; fileName: string }>(),
);

export const uploadFileCoverFailure = createAction(
  '[Storage] Upload File Cover Failure',
  props<{ uploadFileErrorMessage: HttpErrorResponseModel }>(),
);

export const uploadFileCoverSuccess = createAction(
  '[Storage] Upload File Cover Success',
  props<{ urlCover: string[] }>(),
);

export const clearStorageState = createAction('[Storage] Clear Storage State');
