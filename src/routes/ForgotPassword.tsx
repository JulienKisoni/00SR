import React, { useCallback } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { ROUTES } from "../constants/routes";

const initialValues = {
  email: "",
};
const signinSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const onSubmit = useCallback((values: typeof initialValues) => {}, []);
  return (
    <Container>
      <Typography variant="h3" component="h1">
        Forgot password?
      </Typography>
      <Typography variant="subtitle2">
        Enter the email associated with your account and we weill send you
        instructions on how to reset your password.
      </Typography>
      <Formik
        validationSchema={signinSchema}
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
          console.log({ values, errors, touched, isValid });
          return (
            <form onSubmit={handleSubmit}>
              <Stack direction="column" spacing={5}>
                <TextField
                  id="email-address"
                  label="Email address"
                  variant="outlined"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!errors.email}
                  helperText={touched.email ? errors.email : undefined}
                />
                <Button type="submit" disabled={!isValid} variant="contained">
                  Recover password
                </Button>
                <Stack direction="row">
                  <Typography component="p">
                    Already have an account?
                  </Typography>
                  <NavLink to={`/${ROUTES.SIGNIN}`}>
                    <Button variant="text">Sign in</Button>
                  </NavLink>
                </Stack>
              </Stack>
            </form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default ForgotPassword;
