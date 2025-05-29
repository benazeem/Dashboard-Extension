// useAutoRemovePageIfEmpty.ts
import { useDispatch, useSelector } from 'react-redux';
import { removePage, setCurrentPage } from '../store/pageSlice';
import { RootState } from '../store/store';

export const useAutoRemovePageIfEmpty = () => {
  const dispatch = useDispatch();
  const sites = useSelector((state: RootState) => state.sites.items);
  const {pages, navigationDirection} = useSelector((state: RootState) => state.pages);

  // Return a callable function
  const removeEmptyPages = () => {
    pages.forEach((page) => {
      const currentPageItems = sites.filter(
        (item) => item.parent === page.id
      );
     
      if (currentPageItems.length === 0) {
        dispatch(removePage(page.id));
        if (pages.length === 1) {
          dispatch(setCurrentPage(0)); // Set to home if it's the last page
        }
        if(pages.length > 1) {
          const PageIndex = pages.findIndex((p) => p.id === page.id) ; // 0 
          if (PageIndex >= 0) {
            if (navigationDirection === "right") {
              dispatch(setCurrentPage(PageIndex+1));
            } else {
              dispatch(setCurrentPage(PageIndex));
            } // Set to the next page
          
          } else {
            dispatch(setCurrentPage(0)); // Set to home if no previous page exists
          }
        }
      }
    });
  };

  return removeEmptyPages;
};
