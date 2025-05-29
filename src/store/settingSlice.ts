import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TimeFormat = '12h' | '24h';
type OpenWebsiteSetting = 'new_tab' | 'current_tab';
type Theme = 'light' | 'dark';

interface ScreenSaverSettings {
    enabled: boolean;
    fontColor: string;
    startAfterSeconds: number;
    theme: 'light' | 'dark';
}

interface SettingsState {
    timeFormat: TimeFormat;
    fontColor: string;
    openWebsite: OpenWebsiteSetting;
    background: string;
    screenSaver: ScreenSaverSettings;
    theme: Theme;
}

const initialState: SettingsState = {
    timeFormat: '12h',
    fontColor: '#ffffff',
    openWebsite: 'new_tab',
    background: 'wallpaper3.jpg',
    screenSaver: {
        enabled: true,
        fontColor: '#ffffff',
        startAfterSeconds: 20,
        theme: 'dark',
    },
    theme: 'dark',
};

const settingSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTimeFormat(state, action: PayloadAction<TimeFormat>) {
            state.timeFormat = action.payload;
        },
        setFontColor(state, action: PayloadAction<string>) {
            state.fontColor = action.payload;
        },
        setOpenWebsite(state, action: PayloadAction<OpenWebsiteSetting>) {
            state.openWebsite = action.payload;
        },
        setBackground(state, action: PayloadAction<string>) {
            state.background = action.payload;
        },
        setScreenSaverEnabled(state, action: PayloadAction<boolean>) {
            state.screenSaver.enabled = action.payload;
        },
        setScreenSaverFontColor(state, action: PayloadAction<string>) {
            state.screenSaver.fontColor = action.payload;
        },
        setScreenSaverStartAfterTime(state, action: PayloadAction<number>) {
            state.screenSaver.startAfterSeconds = action.payload;
        },
        setTheme(state, action: PayloadAction<Theme>) {
            state.theme = action.payload;
        },
        setScreenSaverSettings(state, action: PayloadAction<ScreenSaverSettings>) {
            state.screenSaver = action.payload;
        },
        setAllSettings(state, action: PayloadAction<SettingsState>) {
            state.timeFormat = action.payload.timeFormat;
            return action.payload;
        },
    },
});

export const {
    setTimeFormat,
    setFontColor,
    setOpenWebsite,
    setBackground,
    setScreenSaverEnabled,
    setScreenSaverFontColor,
    setScreenSaverStartAfterTime,
    setTheme,
    setScreenSaverSettings,
    setAllSettings,
} = settingSlice.actions;

export default settingSlice.reducer;