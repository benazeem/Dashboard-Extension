import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MainLayoutState {
    mainLayout: string;
    theme: string;
}

const initialState: MainLayoutState = {
    mainLayout: "main-app-layout",
    theme: "light",
};

const mainLayoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        setMainLayout: (state, action: PayloadAction<string>) => {
            state.mainLayout = action.payload;
        },
        setTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload;
        },
    },
});

export const { setMainLayout, setTheme } = mainLayoutSlice.actions;
export default mainLayoutSlice.reducer;