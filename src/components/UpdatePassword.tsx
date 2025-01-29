import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Formik, FormikHelpers } from "formik";
import Grid from "@mui/system/Grid";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import * as Yup from "yup";

import { inputGridSystem } from "../constants";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface State {
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showRepeatPassword: boolean;
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
  const [state, setState] = useState<State>({
    showCurrentPassword: false,
    showNewPassword: false,
    showRepeatPassword: false,
  });
  const handleClickShowPassword = useCallback(
    (key: keyof State) => {
      const oldValue = state[key];
      setState((prev) => ({ ...prev, [key]: !oldValue }));
    },
    [state]
  );

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
              <Grid mt={3} container direction={"column"} spacing={2}>
                <Grid {...inputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel
                      margin="dense"
                      shrink
                      htmlFor="current-password"
                    >
                      Current password*
                    </InputLabel>
                    <OutlinedInput
                      id="current-password"
                      placeholder="Current password"
                      size="small"
                      sx={{ marginTop: 2 }}
                      type={state.showCurrentPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handleClickShowPassword("showCurrentPassword")
                            }
                            edge="end"
                          >
                            {state.showCurrentPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      margin="dense"
                      name="currentPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.currentPassword && !!errors.currentPassword
                      }
                    />
                    {touched.currentPassword ? (
                      <FormHelperText>{errors.currentPassword}</FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid {...inputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel margin="dense" shrink htmlFor="new-password">
                      New password*
                    </InputLabel>
                    <OutlinedInput
                      id="new-password"
                      placeholder="New password"
                      size="small"
                      sx={{ marginTop: 2 }}
                      type={state.showNewPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handleClickShowPassword("showNewPassword")
                            }
                            edge="end"
                          >
                            {state.showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      name="newPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.newPassword && !!errors.newPassword}
                    />
                    {touched.newPassword ? (
                      <FormHelperText>{errors.newPassword}</FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid {...inputGridSystem}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel
                      margin="dense"
                      shrink
                      htmlFor="confirm-password"
                    >
                      Confirm password*
                    </InputLabel>
                    <OutlinedInput
                      id="confirm-password"
                      placeholder="Confirm password"
                      size="small"
                      sx={{ marginTop: 2 }}
                      type={state.showRepeatPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handleClickShowPassword("showRepeatPassword")
                            }
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
                      name="confirmPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.confirmPassword && !!errors.confirmPassword
                      }
                    />
                    {touched.confirmPassword ? (
                      <FormHelperText>{errors.confirmPassword}</FormHelperText>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid {...inputGridSystem}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={!isValid}
                  >
                    Update password
                  </Button>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default UpdatePassword;
