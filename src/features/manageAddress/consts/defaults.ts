import type { LatLngTuple, PointTuple } from "leaflet";

import type { AddressMode } from "../model/types/Address";

export const DEFAULT_LOCATION: LatLngTuple = [51.505, -0.09];

export const ADDRESS_MODE_TITLES: Record<
  AddressMode,
  `manageAddress.mode.${string}`
> = {
  choose: "manageAddress.mode.choose",
  add: "manageAddress.mode.add",
  edit: "manageAddress.mode.edit",
} as const;

export const MIN_STREET_QUERY_LENGTH = 3;
export const MIN_CITY_QUERY_LENGTH = 2;

export const DEBOUNCE_DELAY = 500;
export const BLUR_DELAY = 200;

export const DEFAULT_FALLBACK_ADDRESS = "10115 New York";

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 13,
  EDIT_ZOOM: 15,
  ICON_SIZE: [30, 30] as PointTuple,
  ICON_ANCHOR: [15, 30] as PointTuple,
  TOOLTIP_OFFSET: [0, -30] as PointTuple,
} as const;

export const TILE_LAYER_CONFIG = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const;
