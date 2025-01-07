// Add product to localStorage
export const addToLocalStorage = (product) => {
  const favorites = getFavoritesFromLocalStorage();
  if (!favorites.find((fav) => fav._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

// Remove product from localStorage
export const removeFromLocalStorage = (product) => {
  const favorites = getFavoritesFromLocalStorage();
  const updatedFavorites = favorites.filter(
    (favorite) => favorite._id !== product._id
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};

// Retrieve favorites from localStorage
export const getFavoritesFromLocalStorage = () => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
};
