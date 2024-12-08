import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { ROUTES } from "../constants/routes";

interface FormValues {
  email: string;
  password: string;
}

interface Props {
  initialValues: FormValues;
  validationSchema: Yup.ObjectSchema<FormValues>;
  onSubmit: (values: FormValues) => void;
}

const SignIn = ({ initialValues, validationSchema, onSubmit }: Props) => {
  return (
    <Container>
      <Typography variant="h3" component="h1">
        Welcome back
      </Typography>
      <Typography variant="subtitle2">Please enter your details</Typography>
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
            <form>
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

                <NavLink to={`/${ROUTES.FORGOT_PASSWORD}`}>
                  <Button variant="text">Forgot password</Button>
                </NavLink>
                <Button type="submit" disabled={!isValid} variant="contained">
                  Sign In
                </Button>
                <Stack direction="row">
                  <Typography component="p">Don't have an account?</Typography>
                  <NavLink to={`/${ROUTES.SIGNUP}`}>
                    <Button variant="text">Sign up</Button>
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

export default memo(SignIn);
