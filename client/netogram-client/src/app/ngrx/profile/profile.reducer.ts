import { ProfileState } from './profile.state';
import { ProfileModel } from '../../models/profile.model';
import { HttpErrorResponseModel } from '../../models/http-error-response.model';
import { createReducer, on } from '@ngrx/store';
import * as ProfileActions from './profile.actions';

export const initialState: ProfileState = {
  mine: <ProfileModel>{},
  profile: <ProfileModel>{},
  profiles: [],

  isCreating: false,
  isCreateSuccess: false,
  createErrorMessage: <HttpErrorResponseModel>{},

  isUpdating: false,
  isUpdateSuccess: false,
  updateErrorMessage: <HttpErrorResponseModel>{},

  isGettingMine: false,
  isGetMineSuccess: false,
  isGetMineFailure: false,
  getErrorMessage: <HttpErrorResponseModel>{},

  isGettingById: false,
  isGetByIdSuccess: false,
  getErrorMessageById: <HttpErrorResponseModel>{},
};
export const profileReducer = createReducer(
  initialState,
  on(ProfileActions.clearMessages, (state) => {
    return {
      ...state,

      createErrorMessage: <HttpErrorResponseModel>{},

      updateErrorMessage: <HttpErrorResponseModel>{},

      getErrorMessage: <HttpErrorResponseModel>{},

      getErrorMessageById: <HttpErrorResponseModel>{},
    };
  }),

  // createMine
  on(ProfileActions.createMine, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isCreating: true,
    };
  }),

  on(ProfileActions.createMineSuccess, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isCreating: false,
      isCreateSuccess: true,
    };
  }),

  on(ProfileActions.createMineFailure, (state, { createErrorMessage }) => {
    return {
      ...state,
      isCreating: false,
      isCreateSuccess: false,
      createErrorMessage,
    };
  }),

  // updateMine

  on(ProfileActions.updateMine, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isUpdateSuccess: false,
      isUpdating: true,
    };
  }),

  on(ProfileActions.updateMineSuccess, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isUpdating: false,
      isUpdateSuccess: true,
    };
  }),

  on(ProfileActions.updateMineFailure, (state, { updateErrorMessage }) => {
    return {
      ...state,
      isUpdating: false,
      isUpdateSuccess: false,
      updateErrorMessage,
    };
  }),

  // getMine
  on(ProfileActions.getMine, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isGettingMine: true,
    };
  }),
  on(ProfileActions.getMineSuccess, (state, { mine, type }) => {
    console.log(type);
    return {
      ...state,
      isGettingMine: false,
      isGetMineSuccess: true,
      mine: mine,
    };
  }),
  on(ProfileActions.getMineFailure, (state, { getErrorMessage, type }) => {
    console.log(type);
    return {
      ...state,
      isGettingMine: false,
      isGetMineSuccess: false,
      isGetMineFailure: true,
      getErrorMessage: getErrorMessage,
    };
  }),

  // getList

  on(ProfileActions.getList, (state) => {
    return {
      ...state,
    };
  }),

  on(ProfileActions.getListSuccess, (state, { profiles }) => {
    return {
      ...state,
      profiles,
    };
  }),

  on(ProfileActions.getListFailure, (state, { getErrorMessage }) => {
    return {
      ...state,
      getErrorMessage,
    };
  }),

  // getById

  on(ProfileActions.getById, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isGettingById: true,
    };
  }),

  on(ProfileActions.getByIdSuccess, (state, { profile, type }) => {
    console.log(type);
    return {
      ...state,
      isGettingById: false,
      isGetByIdSuccess: true,
      profile: profile,
    };
  }),

  on(ProfileActions.getByIdFailure, (state, { getErrorMessageById, type }) => {
    return {
      ...state,
      isGettingById: false,
      isGetByIdSuccess: false,
      getErrorMessageById,
    };
  }),

  on(ProfileActions.clearGetState, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isGetting: false,
      isGetMineSuccess: false,
      isGetMineFailure: false,
      getErrorMessage: <HttpErrorResponseModel>{},
      mine: null,
    };
  }),

  on(ProfileActions.clearCreateState, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isCreating: false,
      isCreateSuccess: false,
      createErrorMessage: <HttpErrorResponseModel>{},
    };
  }),

  on(ProfileActions.clearUpdateState, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isUpdating: false,
      isUpdateSuccess: false,
      updateErrorMessage: <HttpErrorResponseModel>{},
    };
  }),
);
