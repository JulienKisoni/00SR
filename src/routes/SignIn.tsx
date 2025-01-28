import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/system/Grid";
import { NavLink } from "react-router";
import { Formik } from "formik";
import * as Yup from "yup";

import { ROUTES } from "../constants/routes";
import { inputGridSystem } from "../constants";

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
      <Grid mt={10} container direction={"column"} spacing={2}>
        <Grid {...inputGridSystem}>
          <Typography variant="h3" component="h1">
            Welcome back
          </Typography>
        </Grid>
        <Grid {...inputGridSystem}>
          <Typography variant="subtitle2">Please enter your details</Typography>
        </Grid>
      </Grid>
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
              <Grid mt={3} container direction={"column"} spacing={2}>
                <Grid {...inputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel shrink htmlFor="email-address">
                      Email address
                    </InputLabel>
                    <TextField
                      fullWidth
                      size="small"
                      margin="normal"
                      id="email-address"
                      placeholder="johndoe@mail.com"
                      variant="outlined"
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && !!errors.email}
                      helperText={touched.email ? errors.email : undefined}
                    />
                  </FormControl>
                </Grid>
                <Grid {...inputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel shrink htmlFor="password">
                      Password
                    </InputLabel>
                    <TextField
                      fullWidth
                      size="small"
                      id="password"
                      margin="normal"
                      variant="outlined"
                      placeholder="Enter your password"
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && !!errors.password}
                      helperText={
                        touched.password ? errors.password : undefined
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid {...inputGridSystem}>
                  <Stack direction={"row"} justifyContent={"flex-end"}>
                    <NavLink to={`/${ROUTES.FORGOT_PASSWORD}`}>
                      <Button variant="text">Forgot password</Button>
                    </NavLink>
                  </Stack>
                </Grid>
                <Grid {...inputGridSystem}>
                  <Button
                    fullWidth
                    size="medium"
                    type="submit"
                    disabled={!isValid}
                    variant="contained"
                  >
                    Sign In
                  </Button>
                </Grid>
                <Grid mt={5} {...inputGridSystem}>
                  <Stack
                    direction="row"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Typography variant="subtitle2">
                      Don't have an account?
                    </Typography>
                    <NavLink to={`/${ROUTES.SIGNUP}`}>
                      <Button variant="text">Sign up</Button>
                    </NavLink>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default memo(SignIn);
