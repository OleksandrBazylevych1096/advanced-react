import CircleIcon from "@/shared/assets/icons/Circle.svg?react";
import {useTheme} from "@/shared/config";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";

export const ThemeSwitcher = () => {
    const {toggleTheme} = useTheme();

    return (
        <Button onClick={toggleTheme} theme="ghost">
            <AppIcon Icon={CircleIcon} filled />
        </Button>
    );
};
