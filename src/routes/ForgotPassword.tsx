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
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import { ROUTES } from "../constants/routes";
import { centeredInputGridSystem } from "../constants";

interface FormValues {
  email: string;
}
interface Props {
  initialValues: FormValues;
  validationSchema: Yup.ObjectSchema<FormValues>;
  onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => void;
}

const ForgotPassword = ({
  initialValues,
  validationSchema,
  onSubmit,
}: Props) => {
  return (
    <Container>
      <Grid mt={10} container direction={"column"} spacing={2}>
        <Grid {...centeredInputGridSystem}>
          <Typography variant="h3" component="h1">
            Forgot password?
          </Typography>
        </Grid>
        <Grid {...centeredInputGridSystem}>
          <Typography variant="subtitle2">
            Enter the email associated with your account and we weill send you
            instructions on how to reset your password.
          </Typography>
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
                <Grid {...centeredInputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel shrink htmlFor="email-address">
                      Email address*
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
                <Grid {...centeredInputGridSystem}>
                  <Button
                    size="medium"
                    fullWidth
                    type="submit"
                    disabled={!isValid}
                    variant="contained"
                  >
                    Recover password
                  </Button>
                </Grid>
                <Stack
                  direction="row"
                  alignItems={"center"}
                  justifyContent={"center"}
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

export default memo(ForgotPassword);
