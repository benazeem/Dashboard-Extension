import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './modalSlice';
import siteReducer from './siteSlice';
import pageReducer from './pageSlice';
import folderReducer from './folderSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    sites: siteReducer,
    pages: pageReducer,
    folders: folderReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch