import React, { useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
          console.log({ values });
          const invalid = !dirty || !isValid;
          return (
            <form onSubmit={handleSubmit}>
              <Stack direction="column" spacing={5}>
                <TextField
                  id="product-name"
                  label="Name"
                  variant="outlined"
                  name="name"
                  disabled={disableAll}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && !!errors.name}
                  helperText={touched.name ? errors.name : undefined}
                />
                <TextField
                  id="product-description"
                  label="Description"
                  variant="outlined"
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
                <TextField
                  id="product-minQuantity"
                  label="Minimum quantity"
                  variant="outlined"
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
                <TextField
                  id="product-quantity"
                  label="Quantity"
                  variant="outlined"
                  name="quantity"
                  disabled={disableAll}
                  type="number"
                  value={values.quantity || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quantity && !!errors.quantity}
                  helperText={touched.quantity ? errors.quantity : undefined}
                />
                <TextField
                  id="product-unitPrice"
                  label="Price (CAD)"
                  variant="outlined"
                  name="unitPrice"
                  disabled={disableAll}
                  type="number"
                  value={values.unitPrice || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.unitPrice && !!errors.unitPrice}
                  helperText={touched.unitPrice ? errors.unitPrice : undefined}
                />
                <Stack direction="row">
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
              </Stack>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductForm;
