import { createSlice } from "@reduxjs/toolkit";
import {
  addToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFromLocalStorage,
} from "../../../utils/localStorage";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: getFavoritesFromLocalStorage(),
    favoriteCount: getFavoritesFromLocalStorage().length,
  },
  reducers: {
    addFavorite: (state, action) => {
      addToLocalStorage(action.payload);
      state.favorites.push(action.payload);
      state.favoriteCount = state.favorites.length; // Sync count with favorites array
    },
    removeFavorite: (state, action) => {
      removeFromLocalStorage(action.payload);
      state.favorites = state.favorites.filter(
        (favorite) => favorite._id !== action.payload._id
      );
      state.favoriteCount = state.favorites.length; // Sync count with favorites array
    },
    resetFavorites: (state) => {
      state.favorites = [];
      state.favoriteCount = 0;
      localStorage.setItem("favorites", JSON.stringify([])); // Clear localStorage
    },
  },
});

export const { addFavorite, removeFavorite, resetFavorites } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
