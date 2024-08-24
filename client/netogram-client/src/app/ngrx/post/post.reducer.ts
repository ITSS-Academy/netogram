import { PostState } from './post.state';
import { HttpErrorResponseModel } from '../../models/http-error-response.model';
import { PostModel, PostResponse } from '../../models/post.model';
import { createReducer } from '@ngrx/store';
import { on } from '@ngrx/store';
import * as postActions from './post.actions';
import { ClearMinePost } from './post.actions';

export const initialState: PostState = {
  posts: <PostResponse>{},
  postDetail: <PostModel>{},
  minePosts: <PostResponse>{},

  isCreating: false,
  isCreateSuccess: false,
  createErrorMessage: <HttpErrorResponseModel>{},

  isUpdating: false,
  isUpdateSuccess: false,
  updateErrorMessage: <HttpErrorResponseModel>{},

  isGettingMinePost: false,
  isGetMinePostSuccess: false,
  isGetMinePostFailure: false,
  getErrorMessage: <HttpErrorResponseModel>{},

  isGettingPostDetail: false,
  isGetPostDetailSuccess: false,
  getErrorMessageById: <HttpErrorResponseModel>{},

  isGettingAllPosts: false,
  isGetAllPostsSuccess: false,
  isGetAllPostsFailure: false,
};

export const PostReducer = createReducer(
  initialState,

  //create post
  on(postActions.CreatePost, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isCreating: true,
    };
  }),

  on(postActions.CreatePostSuccess, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isCreating: false,
      isCreateSuccess: true,
    };
  }),

  on(postActions.CreatePostFailure, (state, { createPostErrorMessage }) => {
    console.log(createPostErrorMessage);
    return {
      ...state,
      isCreating: false,
      isCreateSuccess: false,
      createErrorMessage: createPostErrorMessage,
    };
  }),

  //update post

  on(postActions.UpdatePost, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isUpdating: true,
    };
  }),

  on(postActions.UpdatePostSuccess, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isUpdating: false,
      isUpdateSuccess: true,
    };
  }),

  on(postActions.UpdatePostFailure, (state, { updatePostErrorMessage }) => {
    console.log(updatePostErrorMessage);
    return {
      ...state,
      isUpdating: false,
      isUpdateSuccess: false,
      updatePostErrorMessage: updatePostErrorMessage,
    };
  }),

  //get post by id

  on(postActions.GetPostById, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isGettingPostDetail: true,
    };
  }),

  on(postActions.GetPostByIdSuccess, (state, { postDetail, type }) => {
    console.log(type);
    return {
      ...state,
      isGettingPostDetail: false,
      isGetPostDetailSuccess: true,
      postDetail: postDetail,
    };
  }),

  on(postActions.GetPostByIdFailure, (state, { getPostByIdErrorMessage }) => {
    console.log(getPostByIdErrorMessage);
    return {
      ...state,
      isGettingPostDetail: false,
      isGetPostDetailSuccess: false,
      getErrorMessageById: getPostByIdErrorMessage,
    };
  }),

  //get all post

  on(postActions.GetAllPost, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isGettingAllPosts: true,
    };
  }),

  on(postActions.GetAllPostSuccess, (state, { posts, type }) => {
    console.log(type);
    return {
      ...state,
      isGettingAllPosts: false,
      isGetAllPostsSuccess: true,
      posts: posts,
    };
  }),

  on(postActions.GetAllPostFailure, (state, { getAllPostErrorMessage }) => {
    console.log(getAllPostErrorMessage);
    return {
      ...state,
      isGettingAllPosts: false,
      isGetAllPostsSuccess: false,
      getErrorMessage: getAllPostErrorMessage,
    };
  }),

  //get mine post
  on(postActions.GetMinePost, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isGettingMinePost: true,
    };
  }),

  on(postActions.GetMinePostSuccess, (state, { minePosts, type }) => {
    console.log(type);
    return {
      ...state,
      isGettingMinePost: false,
      isGetMinePostSuccess: true,
      minePosts: minePosts,
    };
  }),

  on(postActions.GetMinePostFailure, (state, { getMinePostErrorMessage }) => {
    console.log(getMinePostErrorMessage);
    return {
      ...state,
      isGettingMinePost: false,
      isGetMinePostSuccess: false,
      getErrorMessage: getMinePostErrorMessage,
    };
  }),

  on(postActions.ClearMinePost, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      minePosts: <PostResponse>{},
    };
  }),

  on(postActions.ClearAllPosts, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      posts: <PostResponse>{},
    };
  }),

  on(postActions.ClearPostDetail, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      postDetail: <PostModel>{},
    };
  }),
);
