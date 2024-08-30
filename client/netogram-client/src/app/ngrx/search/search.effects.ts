import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { SearchService } from '../../services/search/search.service';
import * as searchActions from './search.actions';
import { ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class searchEffects {
  search$ = createEffect(() => {
    return this.action$.pipe(
      ofType(searchActions.search),
      switchMap((action) => {
        return this.searchService.search(action.query).pipe(
          map((searchResult) => {
            return searchActions.searchSuccess({ searchResult });
          }),
          catchError((error) => {
            return of(
              searchActions.searchFailure({ searchResultPostFailure: error }),
            );
          }),
        );
      }),
    );
  });

  constructor(
    private action$: Actions,
    private searchService: SearchService,
  ) {}
}
