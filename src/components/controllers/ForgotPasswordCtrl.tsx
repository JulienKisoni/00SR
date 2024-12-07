import React, { useCallback, memo } from "react";
import * as Yup from "yup";
import ForgotPassword from "../../routes/ForgotPassword";

const initialValues = {
  email: "",
};
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

interface FormValues {
  email: string;
}

const ForgotPasswordCtrl = () => {
  const onSubmit = useCallback((values: FormValues) => {}, []);
  return (
    <ForgotPassword
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
};

export default memo(ForgotPasswordCtrl);
