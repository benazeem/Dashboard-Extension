// hooks/useModal.ts
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { showModal as show, hideModal } from '../store/modalSlice';

export const useModal = () => {
  const dispatch = useDispatch();
  const { showModal, type } = useSelector((state: RootState) => state.modal);

  return {
    isModalOpen: showModal,
    type,
    showModal: (type: string) => dispatch(show(type)),
    hideModal: () => dispatch(hideModal()),
  };
};
