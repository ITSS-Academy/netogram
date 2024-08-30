import { SearchState } from './search.state';
import { HttpErrorResponseModel } from '../../models/http-error-response.model';
import { createReducer, on } from '@ngrx/store';
import { CommonSearchResultModel } from '../../models/search.model';
import * as SearchActions from './search.actions';

export const initialState: SearchState = {
  searchResult: <CommonSearchResultModel>{},
  searchResultLoading: false,
  searchResultFailure: <HttpErrorResponseModel>{},
};

export const SearchReducer = createReducer(
  initialState,

  on(SearchActions.search, (state, { query, type }) => {
    console.log(type);
    return {
      ...state,
      searchResultLoading: true,
    };
  }),

  on(SearchActions.searchSuccess, (state, { searchResult, type }) => {
    console.log(type);
    return {
      ...state,
      searchResult: searchResult,
      searchResultLoading: false,
    };
  }),

  on(
    SearchActions.searchFailure,
    (state, { searchResultPostFailure, type }) => {
      console.log(type);
      return {
        ...state,
        searchResultFailure: searchResultPostFailure,
        searchResultLoading: false,
      };
    },
  ),

  on(SearchActions.clearSearch, (state) => {
    return {
      ...state,
      searchResult: <CommonSearchResultModel>{},
    };
  }),
);
