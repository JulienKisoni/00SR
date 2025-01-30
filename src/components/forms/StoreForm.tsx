import React, { useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import Grid from "@mui/system/Grid";
import { inputGridSystem } from "../../constants";
import StyledInput from "../StyledInput";

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

const StoreForm = ({
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
              <Grid marginTop={4} container direction={"column"} spacing={2}>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="store-name"
                    label="Name"
                    name="name"
                    size="small"
                    margin="dense"
                    sx={{ marginTop: 2 }}
                    disabled={disableAll}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name ? errors.name : ""}
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="store-description"
                    label="Description"
                    size="small"
                    margin="dense"
                    sx={{ marginTop: 2 }}
                    disabled={disableAll}
                    multiline
                    minRows={4}
                    maxRows={5}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && !!errors.description}
                    helperText={
                      touched.description && errors.description
                        ? errors.description
                        : ""
                    }
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="address-line1"
                    label="Address line 1"
                    size="small"
                    margin="dense"
                    sx={{ marginTop: 2 }}
                    name="line1"
                    disabled={disableAll}
                    value={values.line1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.line1 && !!errors.line1}
                    helperText={
                      touched.line1 && errors.line1 ? errors.line1 : ""
                    }
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="address-line2"
                    label="Address line 2 (optional)"
                    size="small"
                    margin="dense"
                    sx={{ marginTop: 2 }}
                    name="line2"
                    disabled={disableAll}
                    value={values.line2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.line2 && !!errors.line2}
                    helperText={
                      touched.line2 && errors.line2 ? errors.line2 : ""
                    }
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="store-country"
                    label="Country"
                    size="small"
                    margin="dense"
                    sx={{ marginTop: 2 }}
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel margin="dense" shrink id="labelId-store-state">
                      State*
                    </InputLabel>
                    <Select
                      id="store-state"
                      labelId="labelId-store-state"
                      variant="outlined"
                      name="state"
                      size="small"
                      margin="dense"
                      sx={{ marginTop: 2 }}
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
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="store-city"
                    label="City"
                    size="small"
                    margin="dense"
                    sx={{ marginTop: 2 }}
                    name="city"
                    disabled={disableAll}
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.city && !!errors.city}
                    helperText={touched.city ? errors.city : undefined}
                  />
                </Grid>
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
                    <Button
                      sx={{ marginLeft: 2 }}
                      variant="contained"
                      onClick={onDeleteStore}
                    >
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

export default StoreForm;
