import "./App.css";
import { Routes, Route } from "react-router-dom";
import Groceries from "./Pages/Groceries";
import Navbar from "./Components/Navbar";
import Everything from "./Pages/Everything";
import Juice from "./Pages/Electronic";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import FormPage from "./Pages/FromPage";
import SignUpPage from "./Pages/SignUpPage";
import LogInPage from "./Pages/LogInPage";
import LogOutPage from "./Pages/LogOutPage";
import CartPage from "./Pages/CartPage";
import ForgetPassword from "./Pages/ForgetPassword";
import SignOutPage from "./Pages/SignOutPage";
import OTP from "./Pages/OTP";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Dashboard/Dashboard";
import Settings from "./Dashboard/Settings";
import Products from "./Dashboard/Products";
import PrivateRoute from "./Utils/PrivateRoute";
import MyProfile from "./Dashboard/MyProfile";
import ProductDetails from "./Components/ProductDetails";
import PaymentSuccessPage from "./Pages/PaymentSuccessPage";
import Home from "./Pages/Home";
import AllUsers from "./Admin/AllUsers";
import { useSelector } from "react-redux";
import Notifications from "./Admin/Notifications";
import UserNotifications from "./Dashboard/UserNotifications";
import Orders from "./Dashboard/Orders";
import SellProduct from "./Dashboard/SellProduct";
import VerifyUser from "./Dashboard/VerifyUser";
import ProductPage from "./Pages/ProductPage";
import OrderDetails from "./Pages/OrderDetails";
import Electronic from "./Pages/Electronic";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/groceries" element={<Groceries />} />
        <Route path="/everything" element={<Everything />} />
        <Route path="/electronic" element={<Electronic />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/from" element={<FormPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/otp-verification" element={<OTP />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/logout" element={<LogOutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/signout" element={<SignOutPage />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/:name/product-details/:id" element={<ProductPage />} />
        <Route path="/order-details/:oid/:pid" element={<OrderDetails />} />
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard/myprofile" element={<MyProfile />} />
          <Route path="/dashboard/setting" element={<Settings />} />
          <Route path="/dashboard/product" element={<Products />} />
          <Route path="/dashboard/verify-user" element={<VerifyUser />} />
          <Route
            path="/dashboard/notifications"
            element={<UserNotifications />}
          />
          <Route path="/dashboard/order" element={<Orders />} />
          <Route path="/dashboard/sell-product" element={<SellProduct />} />
          {user?.role === "admin" && (
            <>
              <Route path="/dashboard/admin/users" element={<AllUsers />} />
              <Route
                path="/dashboard/admin/notifications"
                element={<Notifications />}
              />
            </>
          )}

          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
