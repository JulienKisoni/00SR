import React, { useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/system/Grid";

import StyledInput from "../StyledInput";
import { inputGridSystem } from "../../constants";

interface FormValues {
  name: string;
  description: string;
}
interface Props {
  initialValues: FormValues;
  onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => void;
  validationSchema: Yup.ObjectSchema<FormValues>;
  mode?: Types.FormMode;
  onDeleteReport?: () => void;
}

const ReportForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  mode = "add",
  onDeleteReport,
}: Props) => {
  const disableAll = useMemo(() => {
    switch (mode) {
      case "add":
        return false;
      case "readonly":
        return true;
      case "edit":
        return false;
      default:
        return false;
    }
  }, [mode]);
  const buttonTitle = useMemo(() => {
    return mode === "add" ? "Create report" : "Save changes";
  }, [mode]);

  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        validateOnMount
        initialValues={initialValues}
        enableReinitialize
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
          dirty,
          isSubmitting,
          /* and other goodies */
        }) => {
          const invalid = !dirty || !isValid;
          return (
            <form onSubmit={handleSubmit}>
              <Grid container direction={"column"} spacing={2}>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="report-name"
                    inputProps={{
                      "data-testid": "report-name",
                    }}
                    label="Name"
                    name="name"
                    disabled={disableAll}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && !!errors.name}
                    helperText={touched.name ? errors.name : undefined}
                  />
                </Grid>
                <Grid {...inputGridSystem}>
                  <StyledInput
                    id="report-description"
                    inputProps={{
                      "data-testid": "report-description",
                    }}
                    label="Description"
                    multiline
                    minRows={4}
                    maxRows={5}
                    disabled={disableAll}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && !!errors.description}
                    helperText={
                      touched.description ? errors.description : undefined
                    }
                  />
                </Grid>
                <Stack direction="row" spacing={2}>
                  {mode !== "readonly" ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={disableAll || invalid}
                      data-testid="report-submit"
                    >
                      {buttonTitle}
                    </Button>
                  ) : null}
                  {mode === "edit" && onDeleteReport ? (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={onDeleteReport}
                      data-testid="report-delete"
                    >
                      Delete report
                    </Button>
                  ) : null}
                </Stack>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ReportForm;
