import React, { useCallback, memo } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useNotifications } from "@toolpad/core";

import SignUp from "../../routes/Signup";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { User } from "../../classes/User";
import { ROUTES } from "../../constants/routes";
import { regex } from "../../constants";

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
  email: Yup.string()
    .matches(regex.email, "Invalid email format")
    .email("Invalid email")
    .required("Email is required"),
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useNotifications();

  const onSubmit = useCallback(
    (values: FormValues) => {
      const usersSrv = new UsersSrv(dispatch);
      const user = new User({
        email: values.email,
        password: values.password,
        createdAt: new Date().toISOString(),
      });
      const { error } = usersSrv.addOne(user);
      if (error) {
        notifications.show(error.publicMessage, {
          autoHideDuration: 5000,
          severity: "error",
        });
        return;
      }
      notifications.show("Account created successfully", {
        autoHideDuration: 5000,
        severity: "success",
      });
      navigate(`/${ROUTES.SIGNIN}`);
    },
    [navigate, dispatch, notifications]
  );

  return (
    <SignUp
      initialValues={initialValues}
      validationSchema={signupSchema}
      onSubmit={onSubmit}
    />
  );
};

export default memo(SignUpCtrl);
