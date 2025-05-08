import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../store/store";
import { setMainLayout, setTheme } from "./../store/mainLayoutSlice";

const useMainLayout = () => {
    const dispatch = useDispatch();

    const mainLayout = useSelector((state: RootState) => state.layout.mainLayout);
    const theme = useSelector((state: RootState) => state.layout.theme);

    const updateMainLayout = (layout: string) => {
        dispatch(setMainLayout(layout));
    };

    const updateTheme = (newTheme: string) => {
        dispatch(setTheme(newTheme));
    };

    return {
        mainLayout,
        theme,
        updateMainLayout,
        updateTheme,
    };
};

export default useMainLayout;