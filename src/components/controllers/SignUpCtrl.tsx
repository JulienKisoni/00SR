import React, { useCallback, memo } from "react";
import * as Yup from "yup";
import SignUp from "../../routes/SignUp";

interface FormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

const initialValues = {
  email: "",
  password: "",
  repeatPassword: "",
};
const signupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("Password is required"),
  repeatPassword: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("Confirm password is Required")
    .equals([Yup.ref("password")], "Password does not match"),
}) as Yup.ObjectSchema<FormValues>;

const SignUpCtrl = () => {
  const onSubmit = useCallback((values: FormValues) => {}, []);
  return (
    <SignUp
      initialValues={initialValues}
      validationSchema={signupSchema}
      onSubmit={onSubmit}
    />
  );
};

export default memo(SignUpCtrl);
