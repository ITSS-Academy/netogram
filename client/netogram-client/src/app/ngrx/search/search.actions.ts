import { createAction, props } from '@ngrx/store';
import { CommonSearchResultModel } from '../../models/search.model';
import { HttpErrorResponseModel } from '../../models/http-error-response.model';

export const search = createAction(
  '[Search] Search',
  props<{ query: string }>(),
);

export const searchSuccess = createAction(
  '[Search] Search Success',
  props<{ searchResult: CommonSearchResultModel }>(),
);

export const searchFailure = createAction(
  '[Search] Search Failure',
  props<{ searchResultPostFailure: HttpErrorResponseModel }>(),
);

export const clearSearch = createAction('[Search] Clear Search');
