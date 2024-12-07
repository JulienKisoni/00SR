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
  password: "",
  repeatPassword: "",
};
const signupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("Password is required"),
  repeatPassword: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("Confirm password is Required")
    .equals([Yup.ref("password")], "Password does not match"),
});

function SignUp() {
  const onSubmit = useCallback((values: typeof initialValues) => {}, []);

  return (
    <Container>
      <Typography variant="h3" component="h1">
        Welcome
      </Typography>
      <Typography variant="subtitle2">Create a free account</Typography>
      <Formik
        validationSchema={signupSchema}
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
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!errors.password}
                  helperText={touched.password ? errors.password : undefined}
                />
                <TextField
                  id="repeat-password"
                  label="Repeat password"
                  variant="outlined"
                  type="password"
                  name="repeatPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.repeatPassword && !!errors.repeatPassword}
                  helperText={
                    touched.repeatPassword ? errors.repeatPassword : undefined
                  }
                />
                <Button type="submit" disabled={!isValid} variant="contained">
                  Sign up
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
}

export default SignUp;
