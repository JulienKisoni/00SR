import React, { useCallback, useEffect, useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useNavigate, useParams } from "react-router";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Backdrop, CircularProgress } from "@mui/material";

import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import ProductFormCtlr from "../../components/controllers/forms/ProductFormCtrl";
import NotFound from "../NotFound";
import { ProductSrv } from "../../services/controllers/ProductSrv";

interface FormValues {
  name: string;
  description: string;
  minQuantity: number | undefined;
  unitPrice: number | undefined;
  quantity: number | undefined;
}

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({ deny: false });

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
        alert("You do not have access to this product");
        setState((prev) => ({ ...prev, deny: true }));
      }
    }
  }, [selectedStore, product]);

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

  const handleDeleteProduct = useCallback(() => {
    if (product) {
      const message = `Are you sure you wanna delete this product (${product.name})?`;
      // eslint-disable-next-line no-restricted-globals
      const agree = confirm(message);
      if (agree) {
        const productSrv = new ProductSrv(dispatch);
        productSrv.deleteOne(product._id);
        alert("Product deleted");
        navigate(`/${ROUTES.PRODUCTS}`, { replace: true });
      }
    }
  }, [product, dispatch, navigate]);

  if (initialValues === null) {
    return <NotFound />;
  }
  if (loading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (state.deny) {
    return <Navigate to={`/${ROUTES.PRODUCTS}`} replace />;
  }

  return (
    <Stack spacing={2.5} direction="column">
      <Typography variant="h3" component="h1">
        Update product
      </Typography>
      <Typography variant="subtitle2">
        Edit picture and other information about your product
      </Typography>
      <ProductFormCtlr
        mode="edit"
        initialValues={initialValues}
        defaultImgSrc={product?.picture || ""}
        onDeleteProduct={handleDeleteProduct}
        productId={product?._id || ""}
      />
    </Stack>
  );
};

export default EditProduct;
