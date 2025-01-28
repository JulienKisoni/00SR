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
  repeatPassword: string;
}

interface Props {
  initialValues: FormValues;
  validationSchema: Yup.ObjectSchema<FormValues>;
  onSubmit: (values: FormValues) => void;
}

const SignUp = ({ initialValues, validationSchema, onSubmit }: Props) => {
  return (
    <Container>
      <Grid mt={10} container direction={"column"} spacing={2}>
        <Grid {...inputGridSystem}>
          <Typography variant="h3" component="h1">
            Welcome
          </Typography>
        </Grid>
        <Grid {...inputGridSystem}>
          <Typography variant="subtitle2">Create a free account</Typography>
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
                      id="email-address"
                      placeholder="johndoe@mail.com"
                      variant="outlined"
                      type="email"
                      name="email"
                      fullWidth
                      size="small"
                      margin="normal"
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
                      id="password"
                      placeholder="Enter your password"
                      variant="outlined"
                      type="password"
                      name="password"
                      fullWidth
                      size="small"
                      margin="normal"
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
                  <FormControl fullWidth variant="standard">
                    <InputLabel shrink htmlFor="repeat-password">
                      Repeat password
                    </InputLabel>
                    <TextField
                      id="repeat-password"
                      placeholder="Repeat your password"
                      variant="outlined"
                      type="password"
                      name="repeatPassword"
                      fullWidth
                      size="small"
                      margin="normal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.repeatPassword && !!errors.repeatPassword}
                      helperText={
                        touched.repeatPassword
                          ? errors.repeatPassword
                          : undefined
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid {...inputGridSystem}>
                  <Button
                    fullWidth
                    size="medium"
                    type="submit"
                    disabled={!isValid}
                    variant="contained"
                  >
                    Sign up
                  </Button>
                </Grid>
                <Stack
                  direction="row"
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography variant="subtitle2">
                    Already have an account?
                  </Typography>
                  <NavLink to={`/${ROUTES.SIGNIN}`}>
                    <Button variant="text">Sign in</Button>
                  </NavLink>
                </Stack>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default memo(SignUp);
