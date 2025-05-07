// features/pages/pagesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Page {
  id: string;
  name?: string; // optional label like 'Home'
  items?: string[]; // IDs of draggable items
}

interface PagesState {
  pages: Page[];
    currentPage: number; // ID of the currently active page
    navigationDirection:"left"|"right";
}

const initialState: PagesState = {
  pages: [], // default page ID
  currentPage: 0 , // default page ID
  navigationDirection:"right",
};

const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    addPage: (state, action: PayloadAction<{ id: string; name?: string }>) => {
      state.pages.push({ id: action.payload.id, name: action.payload.name });
    },
    removePage: (state, action: PayloadAction<string>) => {
      state.pages = state.pages.filter((page) => page.id !== action.payload);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
        state.currentPage = action.payload;
      },  
    setNavigationDirection: (state, action: PayloadAction<"left" | "right">) => {
      state.navigationDirection = action.payload;
    },
  },
});

export const {
  addPage,
  removePage,
  setCurrentPage,
  setNavigationDirection,
} = pagesSlice.actions;

export default pagesSlice.reducer;
