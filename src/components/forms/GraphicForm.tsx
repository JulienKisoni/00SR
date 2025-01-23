import React, { useMemo } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
              <Stack direction="column" spacing={5}>
                <TextField
                  id="graphic-name"
                  label="Name"
                  variant="outlined"
                  name="name"
                  disabled={disableAll}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && !!errors.name}
                  helperText={touched.name ? errors.name : undefined}
                />
                <TextField
                  id="graphic-description"
                  label="Description"
                  variant="outlined"
                  multiline
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
                <Stack direction="row">
                  {mode !== "readonly" ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={disableAll || invalid}
                    >
                      {buttonTitle}
                    </Button>
                  ) : null}
                  {mode === "edit" && onDeleteGraphic ? (
                    <Button variant="contained" onClick={onDeleteGraphic}>
                      Delete graphic
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default GraphicForm;
