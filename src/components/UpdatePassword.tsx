import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface Props {
  initialValues: FormValues;
  validationSchema: Yup.ObjectSchema<FormValues>;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
}

const UpdatePassword = ({
  initialValues,
  onSubmit,
  validationSchema,
}: Props) => {
  return (
    <Box>
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
          isValid,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Stack direction="column" spacing={5}>
                <TextField
                  id="current-password"
                  label="Current password"
                  variant="outlined"
                  type="password"
                  name="currentPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.currentPassword && !!errors.currentPassword}
                  helperText={
                    touched.currentPassword ? errors.currentPassword : undefined
                  }
                />
                <TextField
                  id="new-password"
                  label="New password"
                  variant="outlined"
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.newPassword && !!errors.newPassword}
                  helperText={
                    touched.newPassword ? errors.newPassword : undefined
                  }
                />
                <TextField
                  id="confirm-password"
                  label="Confirm password"
                  variant="outlined"
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={
                    touched.confirmPassword ? errors.confirmPassword : undefined
                  }
                />
                <Button type="submit" variant="contained" disabled={!isValid}>
                  Update password
                </Button>
              </Stack>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default UpdatePassword;
