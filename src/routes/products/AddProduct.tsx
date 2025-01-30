import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import ProductFormCtlr from "../../components/controllers/forms/ProductFormCtrl";

interface FormValues {
  name: string;
  description: string;
  minQuantity: number | undefined;
  unitPrice: number | undefined;
  quantity: number | undefined;
}
const initialValues: FormValues = {
  name: "",
  description: "",
  minQuantity: undefined,
  quantity: undefined,
  unitPrice: undefined,
};

const AddProduct = () => {
  return (
    <Stack direction="column">
      <Typography variant="h3" component="h1">
        Add product
      </Typography>
      <Typography variant="subtitle1">
        Add a picture and other information about your product
      </Typography>
      <ProductFormCtlr
        mode="add"
        initialValues={initialValues}
        defaultImgSrc=""
        productId=""
      />
    </Stack>
  );
};

export default AddProduct;
