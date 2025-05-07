// SimpleSlider.jsx
import { useRef, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; // Default theme
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import Home from '@/pages/Home';
import DefaultPage from '@/pages/DefaultPage';
import { setCurrentPage } from '@/store/pageSlice';
import {getAllItems} from '@/store/selectors';

const SimpleSlider = () => {
    const dispatch = useDispatch();
  const splideRef = useRef<any>(null);
  const items = useSelector((state: RootState) => getAllItems(state));
    const { pages, currentPage} = useSelector(
      (state: RootState) => state.pages
    );
    //  const widgetItems = useSelector((state: RootState) => state.widgetItems);
  
    const homeItems = items.filter((item) => item.parent === "home");
    const pagesItems: any[] = items.filter((item) =>
      item.parent.startsWith("page-")
    );

    useEffect(() => {
        const splideInstance = splideRef.current?.splide;
        if (splideInstance && splideInstance.go) {
          splideInstance.go(currentPage);
        }
      }, [currentPage]);

      useEffect(() => {
        const splide = splideRef.current?.splide;
        if (!splide) return;
        const onWheel = (event: WheelEvent) => {
          event.preventDefault();
          if (event.deltaY > 0) {
            splide.go('>'); // Next slide
          } else {
            splide.go('<'); // Previous slide
          }
        };
        const container = document.querySelector('.splide'); // or specific wrapper
        container?.addEventListener('wheel', onWheel as EventListener, { passive: false });1
        return () => {
          container?.removeEventListener('wheel', onWheel as EventListener);
        };
      }, []);

      useEffect(() => {
        const splide = splideRef.current?.splide;
        if (!splide) return;
      
        const onMoved = (newIndex: number) => {
          dispatch(setCurrentPage(newIndex));
        };
      
        splide.on('moved', onMoved);
      
        return () => {
          splide.off('moved', onMoved);
        };
      }, [dispatch]);

  return (

      <Splide
        options={{
          type: 'slide',
          perPage: 1,
        rewind: false,
        drag: false,
        arrows: false,
        speed: 500,
        pagination: {
            el:'.splide__pagination',
            classNames: 'splide__pagination',
            clickable: true,
            paginationDirection: 'ltr',
        },
        }}
        aria-label="Simple React Splide Slider"
        className="splide h-[100%] w-full"
        ref={splideRef}
      >
        <SplideSlide index={0} key="page-home" className="splide__slide flex justify-center items-center" >
  <Home homeItems={homeItems} />
</SplideSlide>
{pages.map((page, index) => (
  <SplideSlide key={`page-${page.id}`} className="splide__slide flex justify-center items-center" index={index + 1}> 
    <DefaultPage
      page={page}
      pagesItems={pagesItems}
    />
  </SplideSlide>))}
      </Splide> 
  );
};

export default SimpleSlider;
