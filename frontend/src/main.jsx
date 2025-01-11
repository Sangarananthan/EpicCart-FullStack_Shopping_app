import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import store from "./redux/store.js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Provider } from "react-redux";

// Private Route
import PrivateRoute from "./components/PrivateRoute.jsx";
// Auth
import Profile from "./pages/user/Profile.jsx";
import AdminRoute from "./pages/admin/AdminRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CategoryList from "./pages/admin/CategoryList.jsx";
import ProductCreateForm from "./pages/admin/ProductUpload.jsx";
import AllProducts from "./pages/admin/AllProducts";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/products/Favorites.jsx";
import ProductDetails from "./pages/products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import { Login, Register } from "./pages/auth/Authenticate.jsx";
import Shipping from "./pages/orders/Shipping.jsx";
import PlaceOrder from "./pages/orders/PlaceOrder.jsx";
import Order from "./pages/orders/Order.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />

      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<AdminDashboard />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductCreateForm />} />
        <Route path="product/update/:_id" element={<ProductCreateForm />} />
        <Route path="allProducts" element={<AllProducts />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider
      options={{
        "client-id":
          "AUAEPBH85QeNLtIgfZw13tRtQvWnQKtwXOy1ihkMPeHs4EABP_5hQ6LWz1VBdWz5RZbpkOWV5VVk9J0w",
        currency: "USD",
      }}
    >
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </PayPalScriptProvider>
  </Provider>
);
