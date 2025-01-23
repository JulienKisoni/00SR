import { Routes, Route } from "react-router";

import Stores from "./stores/Stores";
import Settings from "./Settings";
import ProtectedRoute from "../components/ProtectedRoute";
import UnProtectedRoute from "../components/UnProtectedRoute";
import Products from "./products/Products";
import Cart from "./Cart";
import Orders from "./orders/Orders";
import Reports from "./reports/Reports";
import { ROUTES } from "../constants/routes";
import NotFound from "./NotFound";
import SignInCtrl from "../components/controllers/SignInCtrl";
import SignUpCtrl from "../components/controllers/SignUpCtrl";
import ForgotPasswordCtrl from "../components/controllers/ForgotPasswordCtrl";
import AddStore from "./stores/AddStore";
import ViewStore from "./stores/ViewStore";
import EditStore from "./stores/EditStore";
import AddProduct from "./products/AddProduct";
import ViewProduct from "./products/ViewProduct";
import EditProduct from "./products/EditProduct";
import ViewOrder from "./orders/ViewOrder";
import AddReport from "./reports/AddReport";
import ViewReport from "./reports/ViewReport";
import EditReport from "./reports/EditReport";
import Graphics from "./graphics/Graphics";
import AddGraphic from "./graphics/AddGraphic";
import ViewGraphic from "./graphics/ViewGraphic";
import EditGraphic from "./graphics/EditGraphic";

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
        path={`/${ROUTES.STORES}/:storeId`}
        element={
          <ProtectedRoute>
            <ViewStore />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.STORES}/:storeId/edit`}
        element={
          <ProtectedRoute>
            <EditStore />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.STORES}/add`}
        element={
          <ProtectedRoute>
            <AddStore />
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
        path={`/${ROUTES.PRODUCTS}/add`}
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.PRODUCTS}/:productId`}
        element={
          <ProtectedRoute>
            <ViewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.PRODUCTS}/:productId/edit`}
        element={
          <ProtectedRoute>
            <EditProduct />
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
        path={`/${ROUTES.ORDERS}/:orderId`}
        element={
          <ProtectedRoute>
            <ViewOrder />
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
        path={`/${ROUTES.REPORTS}/add`}
        element={
          <ProtectedRoute>
            <AddReport />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.REPORTS}/:reportId`}
        element={
          <ProtectedRoute>
            <ViewReport />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.REPORTS}/:reportId/edit`}
        element={
          <ProtectedRoute>
            <EditReport />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.GRAPHICS}`}
        element={
          <ProtectedRoute>
            <Graphics />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.GRAPHICS}/add`}
        element={
          <ProtectedRoute>
            <AddGraphic />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.GRAPHICS}/:graphicId`}
        element={
          <ProtectedRoute>
            <ViewGraphic />
          </ProtectedRoute>
        }
      />
      <Route
        path={`/${ROUTES.GRAPHICS}/:graphicId/edit`}
        element={
          <ProtectedRoute>
            <EditGraphic />
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
