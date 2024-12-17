import React from "react";
import Container from "@mui/material/Container";
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
    <Container>
      <Stack spacing={2.5} direction="column">
        <Typography variant="h3" component="h1">
          Add product
        </Typography>
        <Typography variant="subtitle2">
          Add a picture and other information about your product
        </Typography>
        <ProductFormCtlr
          mode="add"
          initialValues={initialValues}
          defaultImgSrc=""
          productId=""
        />
      </Stack>
    </Container>
  );
};

export default AddProduct;
