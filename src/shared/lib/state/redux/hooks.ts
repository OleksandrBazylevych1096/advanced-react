import {useDispatch, useSelector, useStore} from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector.withTypes<StateSchema>();
export const useAppStore = useStore.withTypes<AppStore>();
