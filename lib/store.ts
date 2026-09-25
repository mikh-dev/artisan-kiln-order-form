import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TileId = "ocean" | "fern" | "dot" | "star" | "clay" | "mosaic" | "mint" | "sunset";

export type TileDefinition = {
  id: TileId;
  name: string;
  price: number;
};

export const tileCatalog: TileDefinition[] = [
  { id: "ocean", name: "Ocean Wave", price: 28 },
  { id: "fern", name: "Forest Fern", price: 30 },
  { id: "dot", name: "Terracotta Dot", price: 26 },
  { id: "star", name: "Yellow Star", price: 29 },
  { id: "clay", name: "Clay Diamond", price: 32 },
  { id: "mosaic", name: "Mosaic Garden", price: 34 },
  { id: "mint", name: "Mint Chevron", price: 31 },
  { id: "sunset", name: "Sunset Arc", price: 33 },
];

type CartItem = TileDefinition & { quantity: number };

type ShopState = {
  cart: CartItem[];
  grid: Array<TileId | null>;
  activeTile: TileId;
};

const starterGrid: Array<TileId | null> = [
  "star",
  "ocean",
  "sunset",
  "clay",
  null,
  null,
  null,
  "ocean",
  "dot",
  "star",
  "ocean",
  null,
  null,
  null,
  "dot",
  "fern",
  "mint",
  "fern",
  null,
  null,
  null,
  "dot",
  "dot",
  "fern",
  "ocean",
  null,
  null,
  null,
  "clay",
  "dot",
  "ocean",
  "star",
  null,
  null,
  null,
  "ocean",
  "star",
  "fern",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

const initialState: ShopState = {
  cart: tileCatalog.slice(0, 4).map((tile, index) => ({
    ...tile,
    quantity: [4, 3, 5, 2][index],
  })),
  grid: starterGrid,
  activeTile: "ocean",
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    increment(state, action: PayloadAction<TileId>) {
      const item = state.cart.find((entry) => entry.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrement(state, action: PayloadAction<TileId>) {
      const item = state.cart.find((entry) => entry.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeItem(state, action: PayloadAction<TileId>) {
      state.cart = state.cart.filter((entry) => entry.id !== action.payload);
    },
    addNextTile(state) {
      const nextTile = tileCatalog.find(
        (tile) => !state.cart.some((item) => item.id === tile.id),
      );

      if (nextTile) state.cart.push({ ...nextTile, quantity: 1 });
    },
    selectTile(state, action: PayloadAction<TileId>) {
      state.activeTile = action.payload;
    },
    placeTile(state, action: PayloadAction<{ index: number; tile?: TileId }>) {
      state.grid[action.payload.index] = action.payload.tile ?? state.activeTile;
    },
    clearCell(state, action: PayloadAction<number>) {
      state.grid[action.payload] = null;
    },
    clearGrid(state) {
      state.grid = Array(49).fill(null);
    },
  },
});

export const {
  increment,
  decrement,
  removeItem,
  addNextTile,
  selectTile,
  placeTile,
  clearCell,
  clearGrid,
} = shopSlice.actions;

export const store = configureStore({
  reducer: {
    shop: shopSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
