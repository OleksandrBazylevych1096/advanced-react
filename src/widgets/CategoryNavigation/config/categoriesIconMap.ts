import type { FunctionComponent, SVGProps } from "react";

import AppleIcon from "@/shared/assets/icons/Apple.svg?react";
import BreadIcon from "@/shared/assets/icons/Bread.svg?react";
import CakeIcon from "@/shared/assets/icons/Cake.svg?react";
import CarrotIcon from "@/shared/assets/icons/Carrot.svg?react";
import CheeseIcon from "@/shared/assets/icons/Cheese.svg?react";

type CategoriesIconMapType = Record<
  string,
  FunctionComponent<SVGProps<SVGSVGElement>>
>;

export const CategoriesIconMap: CategoriesIconMapType = {
  dairy: CheeseIcon,
  bakery: BreadIcon,
  beverages: AppleIcon,
  seafood: CarrotIcon,
  frozen: CheeseIcon,
  fruits: AppleIcon,
  grains: BreadIcon,
  meat: CarrotIcon,
  sweets: CakeIcon,
  vegetables: CarrotIcon,
  canned: CheeseIcon,
  sauces: BreadIcon,
  snacks: AppleIcon,
  nuts: CakeIcon,
  spices: CarrotIcon,
  household: BreadIcon,
  fallback: AppleIcon,
};
