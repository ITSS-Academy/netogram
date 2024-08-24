import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StorageService } from '../../services/storage/storage.service';
import * as StorageActions from './storage.actions';
import { of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class StorageEffects {
  uploadFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StorageActions.uploadFile),
      switchMap((action) => {
        return this.storageService
          .uploadFile(action.file, action.fileName)
          .pipe(
            map((url) => {
              return StorageActions.uploadFileSuccess({ url: url.urls });
            }),
            catchError((error) => {
              return of(
                StorageActions.uploadFileFailure({
                  uploadFileErrorMessage: error,
                }),
              );
            }),
          );
      }),
    );
  });


  uploadFileCover$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(StorageActions.uploadFileCover),
      switchMap((action) => {
        return this.storageService
          .uploadFileCover(action.file, action.fileName)
          .pipe(
            map((urlCover) => {
              return StorageActions.uploadFileCoverSuccess({ urlCover: urlCover.urls });
            }),
            catchError((error) => {
              return of(
                StorageActions.uploadFileCoverFailure({
                  uploadFileErrorMessage: error,
                }),
              );
            }),
          );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private storageService: StorageService,
  ) {}
}
