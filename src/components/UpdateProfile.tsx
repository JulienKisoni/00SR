import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

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
          dirty,
          isValid,
        }) => {
          const disabled = !dirty || !isValid;
          return (
            <form onSubmit={handleSubmit}>
              <Stack direction="column" spacing={5}>
                <TextField
                  id="username"
                  label="Username"
                  variant="outlined"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && !!errors.username}
                  helperText={touched.username ? errors.username : undefined}
                />
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!errors.email}
                  helperText={touched.email ? errors.email : undefined}
                />
                <Button type="submit" variant="contained" disabled={disabled}>
                  Update profile
                </Button>
              </Stack>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default UpdateProfile;
