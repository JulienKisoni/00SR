import React, { useMemo, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useParams } from "react-router";
import { shallowEqual, useSelector } from "react-redux";
import { useNotifications } from "@toolpad/core";

import { RootState } from "../../services/redux/rootReducer";
import ProductFormCtlr from "../../components/controllers/forms/ProductFormCtrl";
import { ROUTES } from "../../constants/routes";
import NotFound from "../NotFound";
import { Backdrop, CircularProgress } from "@mui/material";

interface FormValues {
  name: string;
  description: string;
  minQuantity: number | undefined;
  unitPrice: number | undefined;
  quantity: number | undefined;
}

const ViewProduct = () => {
  const { productId } = useParams();
  const [state, setState] = useState({ deny: false });

  const notifications = useNotifications();

  const product = useSelector((state: RootState) => {
    return state.products.find((_product) => _product._id === productId);
  }, shallowEqual);
  const selectedStore = useSelector((state: RootState) => {
    return state.user.selectedStore;
  }, shallowEqual);

  const loading = useMemo(() => {
    if (!product || !selectedStore) {
      return true;
    }
    return false;
  }, [product, selectedStore]);

  useEffect(() => {
    if (selectedStore?.products?.length && product?._id) {
      if (!selectedStore?.products.includes(product?._id)) {
        notifications.show("You do not have access to this product", {
          severity: "error",
          autoHideDuration: 5000,
        });
        setState((prev) => ({ ...prev, deny: true }));
      }
    }
  }, [selectedStore, product, notifications]);

  const initialValues: FormValues | null = useMemo(() => {
    if (!product) {
      return null;
    }
    const values: FormValues = {
      name: product.name,
      description: product.description,
      minQuantity: product.minQuantity,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
    };
    return values;
  }, [product]);

  if (initialValues === null) {
    return <NotFound />;
  }
  if (loading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open
        data-testid="backdrop-loading"
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (state.deny) {
    return <Navigate to={`/${ROUTES.PRODUCTS}`} replace />;
  }

  return (
    <Stack spacing={2} direction="column">
      <Typography variant="h3" component="h1">
        {product?.name}
      </Typography>
      <Typography variant="subtitle1">
        View picture and other information about your product
      </Typography>
      <ProductFormCtlr
        mode="readonly"
        initialValues={initialValues}
        defaultImgSrc={product?.picture || ""}
        productId={product?._id || ""}
      />
    </Stack>
  );
};

export default ViewProduct;
