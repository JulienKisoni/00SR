import { Routes, Route } from "react-router";

import Stores from "./Stores";
import Settings from "./Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import UnProtectedRoute from "../components/UnProtectedRoute";
import Products from "./Products";
import Cart from "./Cart";
import Orders from "./Orders";
import Reports from "./Reports";
// @ts-ignore
import SignIn from "./SignIn";
// @ts-ignore
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import { ROUTES } from "../constants/routes";
import NotFound from "./NotFound";

export const ConnectedNavigation = () => {
  return (
    <Routes>
      <Route
        index
        path="/"
        element={
          <ProtectedRoute>
            <Stores />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.STORES}`}
        element={
          <ProtectedRoute>
            <Stores />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.PRODUCTS}`}
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.CART}`}
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.ORDERS}`}
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.REPORTS}`}
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.SETTINGS}`}
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        index
        path="*"
        element={
          <UnProtectedRoute>
            <NotFound />
          </UnProtectedRoute>
        }
      />
    </Routes>
  );
};

export const Navigation = () => {
  return (
    <Routes>
      <Route
        index
        path={`/${ROUTES.SIGNIN}`}
        element={
          <UnProtectedRoute>
            <SignIn />
          </UnProtectedRoute>
        }
      />
      <Route
        index
        path={`/${ROUTES.SIGNUP}`}
        element={
          <UnProtectedRoute>
            <SignUp />
          </UnProtectedRoute>
        }
      />
      <Route
        index
        path={`/${ROUTES.FORGOT_PASSWORD}`}
        element={
          <UnProtectedRoute>
            <ForgotPassword />
          </UnProtectedRoute>
        }
      />
      <Route
        index
        path="*"
        element={
          <UnProtectedRoute>
            <NotFound />
          </UnProtectedRoute>
        }
      />
    </Routes>
  );
};
