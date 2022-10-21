export enum GridItemType {
  PLAYER = "player",
  POTS = "pots",
  COMMUNITY_CARDS = "community cards",
}

export type GridItemConfig = Readonly<
  | {
      type: GridItemType.PLAYER;
      seatNumber: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }
  | { type: GridItemType.POTS }
  | { type: GridItemType.COMMUNITY_CARDS }
>;

type GridConfig = Readonly<{
  columns: number;
  spacing: number;
  itemConfigs: [
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig,
    GridItemConfig
  ];
}>;

export const xs: GridConfig = {
  spacing: 0.25,
  columns: 2,
  itemConfigs: [
    { type: GridItemType.POTS },
    { type: GridItemType.COMMUNITY_CARDS },
    { type: GridItemType.PLAYER, seatNumber: 0 },
    { type: GridItemType.PLAYER, seatNumber: 1 },
    { type: GridItemType.PLAYER, seatNumber: 9 },
    { type: GridItemType.PLAYER, seatNumber: 2 },
    { type: GridItemType.PLAYER, seatNumber: 8 },
    { type: GridItemType.PLAYER, seatNumber: 3 },
    { type: GridItemType.PLAYER, seatNumber: 7 },
    { type: GridItemType.PLAYER, seatNumber: 4 },
    { type: GridItemType.PLAYER, seatNumber: 6 },
    { type: GridItemType.PLAYER, seatNumber: 5 },
  ],
};

export const sm: GridConfig = {
  spacing: 1,
  columns: 3,
  itemConfigs: [
    { type: GridItemType.PLAYER, seatNumber: 0 },
    { type: GridItemType.PLAYER, seatNumber: 1 },
    { type: GridItemType.PLAYER, seatNumber: 2 },
    { type: GridItemType.PLAYER, seatNumber: 9 },
    { type: GridItemType.POTS },
    { type: GridItemType.PLAYER, seatNumber: 3 },
    { type: GridItemType.PLAYER, seatNumber: 8 },
    { type: GridItemType.COMMUNITY_CARDS },
    { type: GridItemType.PLAYER, seatNumber: 4 },
    { type: GridItemType.PLAYER, seatNumber: 7 },
    { type: GridItemType.PLAYER, seatNumber: 6 },
    { type: GridItemType.PLAYER, seatNumber: 5 },
  ],
};

export const lg: GridConfig = {
  spacing: 1,
  columns: 4,
  itemConfigs: [
    { type: GridItemType.PLAYER, seatNumber: 0 },
    { type: GridItemType.PLAYER, seatNumber: 1 },
    { type: GridItemType.PLAYER, seatNumber: 2 },
    { type: GridItemType.PLAYER, seatNumber: 3 },
    { type: GridItemType.PLAYER, seatNumber: 9 },
    { type: GridItemType.POTS },
    { type: GridItemType.COMMUNITY_CARDS },
    { type: GridItemType.PLAYER, seatNumber: 4 },
    { type: GridItemType.PLAYER, seatNumber: 8 },
    { type: GridItemType.PLAYER, seatNumber: 7 },
    { type: GridItemType.PLAYER, seatNumber: 6 },
    { type: GridItemType.PLAYER, seatNumber: 5 },
  ],
};
