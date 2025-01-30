import React, { useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/system/Grid";

import StyledInput from "../StyledInput";
import { inputGridSystem } from "../../constants";

interface FormValues {
  name: string;
  description: string;
  minQuantity: number | undefined;
  unitPrice: number | undefined;
  quantity: number | undefined;
}
interface Props {
  initialValues: FormValues;
  onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => void;
  validationSchema: Yup.ObjectSchema<FormValues>;
  mode?: Types.FormMode;
  onDeleteProduct?: () => void;
}

const ProductForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  mode = "add",
  onDeleteProduct,
}: Props) => {
  const disableAll = useMemo(() => {
    switch (mode) {
      case "add":
        return false;
      case "readonly":
        return true;
      case "edit":
        return false;
      default:
        return false;
    }
  }, [mode]);
  const buttonTitle = useMemo(() => {
    return mode === "add" ? "Create product" : "Save changes";
  }, [mode]);

  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        validateOnMount
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          dirty,
          isSubmitting,
          /* and other goodies */
        }) => {
          const invalid = !dirty || !isValid;
          return (
            <form onSubmit={handleSubmit}>
              <Grid marginTop={4} container direction={"column"} spacing={2}>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="product-name"
                    label="Name"
                    name="name"
                    disabled={disableAll}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && !!errors.name}
                    helperText={touched.name ? errors.name : undefined}
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="product-description"
                    label="Description"
                    multiline
                    disabled={disableAll}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && !!errors.description}
                    helperText={
                      touched.description ? errors.description : undefined
                    }
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="product-minQuantity"
                    label="Minimum quantity"
                    name="minQuantity"
                    disabled={disableAll}
                    type="number"
                    value={values.minQuantity || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.minQuantity && !!errors.minQuantity}
                    helperText={
                      touched.minQuantity ? errors.minQuantity : undefined
                    }
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="product-quantity"
                    label="Quantity"
                    name="quantity"
                    disabled={disableAll}
                    type="number"
                    value={values.quantity || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.quantity && !!errors.quantity}
                    helperText={touched.quantity ? errors.quantity : undefined}
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="product-unitPrice"
                    label="Price (CAD)"
                    name="unitPrice"
                    disabled={disableAll}
                    type="number"
                    value={values.unitPrice || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.unitPrice && !!errors.unitPrice}
                    helperText={
                      touched.unitPrice ? errors.unitPrice : undefined
                    }
                  />
                </Grid>
                <Stack direction="row" spacing={2}>
                  {mode !== "readonly" ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={disableAll || invalid}
                    >
                      {buttonTitle}
                    </Button>
                  ) : null}
                  {mode === "edit" && onDeleteProduct ? (
                    <Button variant="contained" onClick={onDeleteProduct}>
                      Delete store
                    </Button>
                  ) : null}
                </Stack>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductForm;
