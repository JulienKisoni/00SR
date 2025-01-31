import React, { memo, useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/system/Grid";
import {
  OutlinedInput,
  FormHelperText,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { NavLink } from "react-router";
import { Formik } from "formik";
import * as Yup from "yup";
import WidgetsIcon from "@mui/icons-material/Widgets";

import { ROUTES } from "../constants/routes";
import { centeredInputGridSystem } from "../constants";

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
  const [state, setState] = useState({
    showPassword: false,
    showRepeatPassword: false,
  });

  const handleClickShowPassword = useCallback(() => {
    setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);
  const handleClickShowRepeatPassword = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showRepeatPassword: !prev.showRepeatPassword,
    }));
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
            Welcome
          </Typography>
        </Grid>
        <Grid {...centeredInputGridSystem}>
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
                  <FormControl fullWidth variant="standard">
                    <InputLabel margin="dense" shrink htmlFor="password">
                      Password*
                    </InputLabel>
                    <OutlinedInput
                      id="password"
                      sx={{ marginTop: 2 }}
                      placeholder="Enter your password"
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
                      name="password"
                      fullWidth
                      size="small"
                      margin="dense"
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
                  <FormControl fullWidth variant="standard">
                    <InputLabel margin="dense" shrink htmlFor="repeat-password">
                      Repeat password*
                    </InputLabel>
                    <OutlinedInput
                      id="repeat-password"
                      sx={{ marginTop: 2 }}
                      placeholder="Repeat your password"
                      type={state.showRepeatPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowRepeatPassword}
                            edge="end"
                          >
                            {state.showRepeatPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      name="repeatPassword"
                      fullWidth
                      size="small"
                      margin="dense"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.repeatPassword && !!errors.repeatPassword}
                    />
                    {touched.repeatPassword ? (
                      <FormHelperText>{errors.repeatPassword}</FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid {...centeredInputGridSystem}>
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
                    <Button sx={{ textDecoration: "underline" }} variant="text">
                      Sign in
                    </Button>
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
