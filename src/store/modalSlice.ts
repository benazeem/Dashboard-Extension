// store/ModalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  showModal: boolean;
  type: string | null;
}

const initialState: ModalState = {
  showModal: false,
  type: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal(state, action: PayloadAction<string>) {
      state.showModal = true;
      state.type = action.payload;
    },
    hideModal(state) {
      state.showModal = false;
      state.type = null;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
