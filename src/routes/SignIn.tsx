import React, { memo, useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Grid from "@mui/system/Grid";
import { NavLink } from "react-router";
import { Formik } from "formik";
import * as Yup from "yup";
import WidgetsIcon from "@mui/icons-material/Widgets";

import { ROUTES } from "../constants/routes";
import { centeredInputGridSystem } from "../constants";

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
  const [state, setState] = useState({ showPassword: false });

  const handleClickShowPassword = useCallback(() => {
    setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  return (
    <Container>
      <Stack mt={4} direction={"row"} alignItems="center">
        <WidgetsIcon fontSize="large" color="primary" />
        <Typography ml={2} component="h1" variant="h5">
          My Inventory Manager
        </Typography>
      </Stack>
      <Grid mt={10} container direction={"column"} spacing={2}>
        <Grid {...centeredInputGridSystem}>
          <Typography variant="h3" component="h1">
            Welcome back
          </Typography>
        </Grid>
        <Grid {...centeredInputGridSystem}>
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
                <Grid {...centeredInputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel shrink htmlFor="email-address">
                      Email address*
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
                <Grid {...centeredInputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel margin="dense" shrink htmlFor="password">
                      Password*
                    </InputLabel>
                    <OutlinedInput
                      fullWidth
                      size="small"
                      margin="dense"
                      sx={{ marginTop: 2 }}
                      id="password"
                      placeholder="Enter your password"
                      name="password"
                      type={state.showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {state.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && !!errors.password}
                    />
                    {touched.password ? (
                      <FormHelperText>{errors.password}</FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid {...centeredInputGridSystem}>
                  <Stack direction={"row"} justifyContent={"flex-end"}>
                    <NavLink to={`/${ROUTES.FORGOT_PASSWORD}`}>
                      <Button
                        sx={{ textDecoration: "underline" }}
                        variant="text"
                      >
                        Forgot password
                      </Button>
                    </NavLink>
                  </Stack>
                </Grid>
                <Grid {...centeredInputGridSystem}>
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
                <Grid mt={5} {...centeredInputGridSystem}>
                  <Stack
                    direction="row"
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Typography variant="subtitle2">
                      Don't have an account?
                    </Typography>
                    <NavLink to={`/${ROUTES.SIGNUP}`}>
                      <Button
                        sx={{ textDecoration: "underline" }}
                        variant="text"
                      >
                        Sign up
                      </Button>
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
