import React, { useCallback, memo } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useNotifications } from "@toolpad/core/useNotifications";

import SignIn from "../../routes/SignIn";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { ROUTES } from "../../constants/routes";
import { regex } from "../../constants";

const initialValues = {
  email: "",
  password: "",
};
interface FormValues {
  email: string;
  password: string;
}
const signinSchema = Yup.object().shape({
  email: Yup.string()
    .matches(regex.email, "Invalid email format")
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("Password is required"),
});
const SignInCtrl = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useNotifications();

  const onSubmit = useCallback(
    (values: FormValues) => {
      const usersSrv = new UsersSrv(dispatch);
      const { error } = usersSrv.login(values);
      if (error) {
        notifications.show(error.publicMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
        return;
      }
      notifications.show("Login successful", {
        severity: "success",
        autoHideDuration: 5000,
      });
      navigate(`/${ROUTES.STORES}`);
    },
    [navigate, dispatch, notifications]
  );
  return (
    <SignIn
      initialValues={initialValues}
      validationSchema={signinSchema}
      onSubmit={onSubmit}
    />
  );
};

export default memo(SignInCtrl);
