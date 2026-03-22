import {useEffect, useState, type ReactNode} from "react";

import {LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext} from "@/shared/config";
import type {ThemeType} from "@/shared/config";

interface ThemeProviderProps {
    children: ReactNode;
}

const defaultTheme = (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as ThemeType) || Theme.PINK;

export const ThemeProvider = ({children}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<ThemeType>(defaultTheme);

    useEffect(() => {
        document.body.className = `${theme}`;
    }, [theme]);

    return <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>;
};
