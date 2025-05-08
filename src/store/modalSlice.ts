// store/ModalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  showModal: boolean;
  modalChild: string | null;
}

const initialState: ModalState = {
  showModal: false,
  modalChild: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal(state, action: PayloadAction<string>) {
      state.showModal = true;
      state.modalChild = action.payload;
    },
    hideModal(state) {
      state.showModal = false;
      state.modalChild = null;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
