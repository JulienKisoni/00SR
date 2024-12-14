import { Routes, Route } from "react-router";

import Stores from "./stores/Stores";
import Settings from "./Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import UnProtectedRoute from "../components/UnProtectedRoute";
import Products from "./Products";
import Cart from "./Cart";
import Orders from "./Orders";
import Reports from "./Reports";
import { ROUTES } from "../constants/routes";
import NotFound from "./NotFound";
import SignInCtrl from "../components/controllers/SignInCtrl";
import SignUpCtrl from "../components/controllers/SignUpCtrl";
import ForgotPasswordCtrl from "../components/controllers/ForgotPasswordCtrl";
import AddStore from "./stores/AddStore";

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
      >
        <Route
          path={`/${ROUTES.STORES}/add`}
          element={
            <ProtectedRoute>
              <AddStore />
            </ProtectedRoute>
          }
        />
      </Route>
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

export const NotConnectedNavigation = () => {
  return (
    <Routes>
      <Route
        index
        path={`/${ROUTES.SIGNIN}`}
        element={
          <UnProtectedRoute>
            <SignInCtrl />
          </UnProtectedRoute>
        }
      />
      <Route
        index
        path={`/${ROUTES.SIGNUP}`}
        element={
          <UnProtectedRoute>
            <SignUpCtrl />
          </UnProtectedRoute>
        }
      />
      <Route
        index
        path={`/${ROUTES.FORGOT_PASSWORD}`}
        element={
          <UnProtectedRoute>
            <ForgotPasswordCtrl />
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
