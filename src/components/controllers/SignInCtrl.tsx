import React, { useCallback, memo } from "react";
import * as Yup from "yup";
import SignIn from "../../routes/SignIn";

const initialValues = {
  email: "",
  password: "",
};
interface FormValues {
  email: string;
  password: string;
}
const signinSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("Password is required"),
});
const SignInCtrl = () => {
  const onSubmit = useCallback((values: FormValues) => {}, []);
  return (
    <SignIn
      initialValues={initialValues}
      validationSchema={signinSchema}
      onSubmit={onSubmit}
    />
  );
};

export default memo(SignInCtrl);
