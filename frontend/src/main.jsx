import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import store from "./redux/store.js";
import { Provider } from "react-redux";

// Private Route
import PrivateRoute from "./components/PrivateRoute.jsx";
// Auth
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Profile from "./pages/user/Profile.jsx";
import AdminRoute from "./pages/admin/AdminRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CategoryList from "./pages/admin/CategoryList.jsx";
import ProductCreateForm from "./pages/admin/ProductUpload.jsx";
import AllProducts from "./pages/admin/AllProducts";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
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
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);
