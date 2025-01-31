import React, { useCallback, useState } from "react";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useNotifications } from "@toolpad/core";

import ImagePicker from "../../ImagePicker";
import { GenericError } from "../../../classes/GenericError";
import { RootState } from "../../../services/redux/rootReducer";
import { ROUTES } from "../../../constants/routes";
import ProductForm from "../../forms/ProductForm";
import { Product } from "../../../classes/Product";
import { ProductSrv } from "../../../services/controllers/ProductSrv";
import { StoreSrv } from "../../../services/controllers/StoreSrv";
import { HistorySrv } from "../../../services/controllers/HistorySrv";
import { History } from "../../../classes/History";

interface FormValues {
  name: string;
  description: string;
  minQuantity: number | undefined;
  unitPrice: number | undefined;
  quantity: number | undefined;
}

const validationSchema = Yup.object<FormValues>().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string()
    .required("Description is required")
    .min(6, "Too short")
    .max(250, "Too long"),
  minQuantity: Yup.number().required("Minimum quantity is required"),
  unitPrice: Yup.number().required("Unit price is required"),
  quantity: Yup.number().required("Quantity is required"),
});

interface Props {
  initialValues: FormValues;
  mode?: Types.FormMode;
  defaultImgSrc: string;
  onDeleteProduct?: () => void;
  productId: string;
}

const ProductFormCtlr = ({
  mode = "add",
  initialValues,
  defaultImgSrc = "",
  onDeleteProduct,
  productId = "",
}: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);
  const selectedStore = useSelector((state: RootState) => {
    return state.user.selectedStore;
  }, shallowEqual);

  const [state, setState] = useState({ picture: "" });

  const onSubmit = useCallback(
    async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (!connectedUser) {
        notifications.show("No connected user", {
          autoHideDuration: 5000,
          severity: "error",
        });
        return;
      } else if (!selectedStore) {
        notifications.show("No selected store", {
          autoHideDuration: 5000,
          severity: "error",
        });
        return;
      }
      const newProduct = new Product({
        values: {
          ...values,
          minQuantity: values.minQuantity || 0,
          unitPrice: values.unitPrice || 0,
          quantity: values.quantity || 0,
        },
        owner: connectedUser._id,
        picture: state.picture,
        id: productId,
        storeId: selectedStore._id || "",
      });

      const productSrv = new ProductSrv(dispatch);
      const historySrv = new HistorySrv(dispatch, productSrv);
      const storeSrv = new StoreSrv(dispatch);
      if (mode === "add") {
        const payload = newProduct.toObject();
        const { error } = productSrv.addOne<Types.IProductDocument>(payload);
        if (error) {
          notifications.show(error.publicMessage, {
            autoHideDuration: 5000,
            severity: "error",
          });
          return;
        } else {
          storeSrv.addProductToStore(selectedStore._id || "", newProduct._id);
          helpers.resetForm();
          await helpers.validateForm();
          notifications.show("Product created", {
            autoHideDuration: 5000,
            severity: "success",
          });
          navigate(`/${ROUTES.PRODUCTS}`, { replace: true });
        }
      } else if (mode === "edit") {
        const payload = newProduct.compareWithOld(initialValues);
        if (payload.quantity) {
          const history = new History({
            storeId: selectedStore._id,
            productId,
            productName: newProduct.name,
          });
          history.pushEvolution(payload.quantity);
          historySrv.addOne(history.toObject());
        }
        productSrv.updateOne(productId, payload);
        helpers.resetForm({ values });
        await helpers.validateForm();
        notifications.show("Product updated", {
          autoHideDuration: 5000,
          severity: "success",
        });
      }
    },
    [
      state,
      connectedUser,
      dispatch,
      mode,
      initialValues,
      productId,
      selectedStore,
      navigate,
      notifications,
    ]
  );
  const onFileUploadError = useCallback(
    (error: GenericError) => {
      notifications.show(error.publicMessage, {
        autoHideDuration: 5000,
        severity: "error",
      });
    },
    [notifications]
  );
  const onFileUploadSuccess = useCallback(
    ({ downloadURL }: { downloadURL: string }) => {
      setState((prev) => ({ ...prev, picture: downloadURL }));
    },
    []
  );

  return (
    <div>
      <ImagePicker
        alt="product"
        defaultSrc={defaultImgSrc}
        onError={onFileUploadError}
        onSuccess={onFileUploadSuccess}
        disabled={mode === "readonly"}
      />
      <ProductForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        mode={mode}
        onDeleteProduct={onDeleteProduct}
      />
    </div>
  );
};

export default ProductFormCtlr;
