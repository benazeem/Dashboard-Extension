import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './modalSlice';
import siteReducer from './siteSlice';
import pageReducer from './pageSlice';
import folderReducer from './folderSlice';
import layoutReducer from './mainLayoutSlice';
import settingReducer from './settingSlice';
import widgetReducer from './widgetSlice';


export const store = configureStore({
  reducer: {
    modal: modalReducer,
    sites: siteReducer,
    pages: pageReducer,
    folders: folderReducer,
    layout: layoutReducer,
    settings: settingReducer,
        widgets: widgetReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch