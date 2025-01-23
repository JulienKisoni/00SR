import React, { useCallback, useState } from "react";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import ImagePicker from "../../ImagePicker";
import { GenericError } from "../../../classes/GenericError";
import { RootState } from "../../../services/redux/rootReducer";
import { ROUTES } from "../../../constants/routes";
import ProductForm from "../../forms/ProductForm";
import { Product } from "../../../classes/Product";
import { ProductSrv } from "../../../services/controllers/ProductSrv";
import { StoreSrv } from "../../../services/controllers/StoreSrv";

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
        alert("No connected user");
        return;
      } else if (!selectedStore) {
        alert("No selected store");
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
      const storeSrv = new StoreSrv(dispatch);
      if (mode === "add") {
        const payload = newProduct.toObject();
        const { error } = productSrv.addOne<Types.IProductDocument>(payload);
        if (error) {
          alert(error.publicMessage);
          return;
        } else {
          storeSrv.addProductToStore(selectedStore._id || "", newProduct._id);
          helpers.resetForm();
          await helpers.validateForm();
          alert("Product created");
          navigate(`/${ROUTES.PRODUCTS}`, { replace: true });
        }
      } else if (mode === "edit") {
        const payload = newProduct.compareWithOld(initialValues);
        productSrv.updateOne(productId, payload);
        helpers.resetForm({ values });
        await helpers.validateForm();
        alert("Product updated");
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
    ]
  );
  const onFileUploadError = useCallback((error: GenericError) => {
    alert(error.publicMessage);
  }, []);
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
