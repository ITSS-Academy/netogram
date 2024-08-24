import { StorageState } from './storage.state';
import { StorageModel } from '../../models/storage.model';
import { HttpErrorResponseModel } from '../../models/http-error-response.model';
import { createReducer } from '@ngrx/store';
import { on } from '@ngrx/store';
import * as StorageActions from './storage.actions';

export const initialState: StorageState = {
  storage: <StorageModel>{},
  isUploading: false,
  uploadError: <HttpErrorResponseModel>{},
  url: [],
  urlCover: [],
};

export const StorageReducer = createReducer(
  initialState,
  on(StorageActions.uploadFile, (state, action) => {
    console.log(action.type);
    return {
      ...state,
      isUploading: true,
    };
  }),

  on(StorageActions.uploadFileSuccess, (state, { type, url }) => {
    console.log(type);
    console.log(url);
    return {
      ...state,
      isUploading: false,
      url: url,
    };
  }),

  on(
    StorageActions.uploadFileFailure,
    (state, { type, uploadFileErrorMessage }) => {
      console.log(type);
      return {
        ...state,
        isUploading: false,
        uploadError: uploadFileErrorMessage,
      };
    },
  ),

  on(StorageActions.uploadFileCover, (state, action) => {
    console.log(action.type);
    return {
      ...state,
      isUploading: true,
    };
  }),

  on(StorageActions.uploadFileCoverSuccess, (state, { type, urlCover }) => {
    console.log(type);
    console.log(urlCover);
    return {
      ...state,
      isUploading: false,
      urlCover: urlCover,
    };
  }),

  on(
    StorageActions.uploadFileCoverFailure,
    (state, { type, uploadFileErrorMessage }) => {
      console.log(type);
      return {
        ...state,
        isUploading: false,
        uploadError: uploadFileErrorMessage,
      };
    },
  ),

  on(StorageActions.clearStorageState, (state) => {
    return {
      ...state,
      isUploading: false,
      uploadError: <HttpErrorResponseModel>{},
      url: [],
      urlCover: [],
    };
  }),
);
