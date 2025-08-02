import CircleIcon from "@/shared/assets/icons/Circle.svg?react";
import { useTheme } from "@/shared/config";
import { AppIcon, Button } from "@/shared/ui";

export const ThemeSwitcher = () => {
  const { toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} theme="ghost">
      <AppIcon Icon={CircleIcon} filled />
    </Button>
  );
};
