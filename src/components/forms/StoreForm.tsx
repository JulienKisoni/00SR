import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

interface FormValues {
  line1: string;
  line2?: string;
  country: string;
  state: string;
  city: string;
  name: string;
  description: string;
}
const initialValues: FormValues = {
  line1: "",
  line2: "",
  country: "",
  state: "",
  city: "Canada",
  name: "",
  description: "",
};
const validationSchema = Yup.object<FormValues>().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string()
    .required("Description is required")
    .min(6, "Too short")
    .max(150, "Too long"),
  line1: Yup.string().required("Line 1 is required"),
  line2: Yup.string(),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
});

const STATES = [
  { value: "Alberta", label: "Alberta" },
  { value: "Colombie-Britannique", label: "Colombie-Britannique" },
  { value: "Manitoba", label: "Manitoba" },
  { value: "Nouveau-Brunswick", label: "Nouveau-Brunswick" },
  { value: "Terre-Neuve-et-Labrador", label: "Terre-Neuve-et-Labrador" },
  { value: "Nouvelle-Écosse", label: "Nouvelle-Écosse" },
  { value: "Ontario", label: "Ontario" },
  { value: "Île-du-Prince-Édouard", label: "Île-du-Prince-Édouard" },
  { value: "Québec", label: "Québec" },
  { value: "Saskatchewan", label: "Saskatchewan" },
  { value: "Territoires du Nord-Ouest", label: "Territoires du Nord-Ouest" },
  { value: "Nunavut", label: "Nunavut" },
  { value: "Yukon", label: "Yukon" },
];

const StoreForm = () => {
  const onSubmit = () => {};
  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        validateOnMount
        initialValues={initialValues}
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
          isSubmitting,
          /* and other goodies */
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Stack direction="column" spacing={5}>
                <TextField
                  id="store-name"
                  label="Name"
                  variant="outlined"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && !!errors.name}
                  helperText={touched.name ? errors.name : undefined}
                />
                <TextField
                  id="store-description"
                  label="Description"
                  variant="outlined"
                  name="description"
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
                  disabled
                  value={values.country}
                />
                <FormControl>
                  <InputLabel id="labelId-store-state">State</InputLabel>
                  <Select
                    id="store-state"
                    labelId="labelId-store-state"
                    label="State"
                    variant="outlined"
                    name="state"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.state && !!errors.state}
                  >
                    {STATES.map((state) => (
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.city && !!errors.city}
                  helperText={touched.city ? errors.city : undefined}
                />
              </Stack>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default StoreForm;
