import { useRef, useEffect, useMemo } from 'react';
import { Splide, SplideSlide } from '../../node_modules/@splidejs/react-splide';
// import '../../node_modules/@splidejs/react-splide/dist/css/splide.min.css'; // Default theme
import '../../node_modules/@splidejs/react-splide/dist/css/themes/splide-skyblue.min.css'; // Custom theme
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import Home from '@/components/sliderPages/Home';
import DefaultPage from '@/components/sliderPages/DefaultPage';
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
    const memoizedItems = useMemo(() => items, [items]);

  
    const homeItems = memoizedItems.filter((item) => item.parent === "home");
    const pagesItems: any[] = memoizedItems.filter((item) =>
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
        // pagination: {
        //     el:'.splide__pagination',
        //     classNames: 'splide__pagination',
        //     clickable: true,
        //     paginationDirection: 'ltr',
        // },
        pagination: true,
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
