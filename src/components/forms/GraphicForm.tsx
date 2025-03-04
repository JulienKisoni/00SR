import React, { useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/system/Grid";

import { inputGridSystem } from "../../constants";
import StyledInput from "../StyledInput";

interface FormValues {
  name: string;
  description: string;
}
interface Props {
  initialValues: FormValues;
  onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => void;
  validationSchema: Yup.ObjectSchema<FormValues>;
  mode?: Types.FormMode;
  onDeleteGraphic?: () => void;
}

const GraphicForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  mode = "add",
  onDeleteGraphic,
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
    return mode === "add" ? "Create graphic" : "Save changes";
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
                    id="graphic-name"
                    inputProps={{
                      "data-testid": "graphic-name",
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
                    id="graphic-description"
                    inputProps={{
                      "data-testid": "graphic-description",
                    }}
                    label="Description"
                    multiline
                    disabled={disableAll}
                    name="description"
                    minRows={4}
                    maxRows={5}
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
                      data-testid="graphic-submit"
                    >
                      {buttonTitle}
                    </Button>
                  ) : null}
                  {mode === "edit" && onDeleteGraphic ? (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={onDeleteGraphic}
                      data-testid="graphic-delete"
                    >
                      Delete graphic
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

export default GraphicForm;
