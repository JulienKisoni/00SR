import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/system/Grid";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { inputGridSystem } from "../constants";

interface FormValues {
  username: string;
  email: string;
}
interface Props {
  initialValues: FormValues;
  validationSchema: Yup.ObjectSchema<FormValues>;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
}

const UpdateProfile = ({
  initialValues,
  onSubmit,
  validationSchema,
}: Props) => {
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validateOnMount
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        dirty,
        isValid,
      }) => {
        const disabled = !dirty || !isValid;
        return (
          <form onSubmit={handleSubmit}>
            <Grid mt={3} container direction={"column"} spacing={2}>
              <Grid {...inputGridSystem}>
                <FormControl fullWidth variant="standard">
                  <InputLabel margin="dense" shrink htmlFor="username">
                    Username*
                  </InputLabel>
                  <OutlinedInput
                    id="username"
                    inputProps={{
                      "data-testid": "username",
                    }}
                    placeholder="Username"
                    name="username"
                    size="small"
                    sx={{ marginTop: 2 }}
                    margin="dense"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && !!errors.username}
                  />
                  {touched.username ? (
                    <FormHelperText>{errors.username}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid {...inputGridSystem}>
                <FormControl fullWidth variant="standard">
                  <InputLabel margin="dense" shrink htmlFor="email">
                    Email*
                  </InputLabel>
                  <OutlinedInput
                    id="email"
                    inputProps={{
                      "data-testid": "email",
                    }}
                    placeholder="Email"
                    type="email"
                    name="email"
                    size="small"
                    sx={{ marginTop: 2 }}
                    margin="dense"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && !!errors.email}
                  />
                  {touched.email ? (
                    <FormHelperText>{errors.email}</FormHelperText>
                  ) : null}
                </FormControl>
              </Grid>
              <Grid {...inputGridSystem}>
                <Button
                  fullWidth={false}
                  type="submit"
                  variant="contained"
                  disabled={disabled}
                  data-testid="profile-submit"
                >
                  Update profile
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
};

export default UpdateProfile;
