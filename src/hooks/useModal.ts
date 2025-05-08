// hooks/useModal.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { showModal as show, hideModal } from '../store/modalSlice';

export const useModal = () => {
  const dispatch = useDispatch();
  const { showModal, modalChild } = useSelector((state: RootState) => state.modal);

  return {
    isModalOpen: showModal,
    modalChild,
    showModal: (modalChild: string) => dispatch(show(modalChild)),
    hideModal: () => dispatch(hideModal()),
  };
};
