// features/widgets/widgetSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WidgetItem } from '../types';

interface WidgetState {
  items: WidgetItem[];
}

const initialState: WidgetState = {
  items: [],
};

export const widgetSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<WidgetItem>) => {
      state.items.push(action.payload);
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((widget: WidgetItem) => widget.id !== action.payload);
    },
    clearWidgets: (state) => {
      state.items = [];
    }
  },
});

export const { addWidget, removeWidget, clearWidgets } = widgetSlice.actions;
export default widgetSlice.reducer;
