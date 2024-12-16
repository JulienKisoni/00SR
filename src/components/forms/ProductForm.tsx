import React, { useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";

interface FormValues {
  line1: string;
  line2?: string;
  country: string;
  state: string;
  city: string;
  name: string;
  description: string;
}
interface Props {
  initialValues: FormValues;
  onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => void;
  validationSchema: Yup.ObjectSchema<FormValues>;
  states: { value: string; label: string }[];
  mode?: Types.FormMode;
  onDeleteStore?: () => void;
}

const ProductForm = ({
  initialValues,
  validationSchema,
  states,
  onSubmit,
  mode = "add",
  onDeleteStore,
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
    return mode === "add" ? "Create store" : "Save changes";
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
              <Stack direction="column" spacing={5}>
                <TextField
                  id="store-name"
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
                  id="store-description"
                  label="Description"
                  variant="outlined"
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
                  id="address-line1"
                  label="Address line 1"
                  variant="outlined"
                  name="line1"
                  disabled={disableAll}
                  value={values.line1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.line1 && !!errors.line1}
                  helperText={touched.line1 ? errors.line1 : undefined}
                />
                <TextField
                  id="address-line2"
                  label="Address line 2 (optional)"
                  variant="outlined"
                  name="line2"
                  disabled={disableAll}
                  value={values.line2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.line2 && !!errors.line2}
                  helperText={touched.line2 ? errors.line2 : undefined}
                />
                <TextField
                  id="store-country"
                  label="Country"
                  variant="outlined"
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  disabled
                />
                <FormControl>
                  <InputLabel id="labelId-store-state">State Label</InputLabel>
                  <Select
                    id="store-state"
                    labelId="labelId-store-state"
                    label="State"
                    variant="outlined"
                    name="state"
                    onChange={handleChange}
                    disabled={disableAll}
                    value={values.state}
                    onBlur={handleBlur}
                    error={touched.state && !!errors.state}
                  >
                    {states.map((state) => (
                      <MenuItem key={state.value} value={state.value}>
                        {state.label}
                      </MenuItem>
                    ))}
                    <FormHelperText>
                      {touched.state ? errors.state : ""}
                    </FormHelperText>
                  </Select>
                </FormControl>
                <TextField
                  id="store-city"
                  label="City"
                  variant="outlined"
                  name="city"
                  disabled={disableAll}
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.city && !!errors.city}
                  helperText={touched.city ? errors.city : undefined}
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
                  {mode === "edit" && onDeleteStore ? (
                    <Button variant="contained" onClick={onDeleteStore}>
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
