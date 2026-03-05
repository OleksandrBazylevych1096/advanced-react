import {useDispatch, useSelector, useStore} from "react-redux";

import type {AppStore} from "@/app/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector.withTypes<StateSchema>();
export const useAppStore = useStore.withTypes<AppStore>();
