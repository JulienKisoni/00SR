import React, { useCallback } from "react";
import * as Yup from "yup";
import { FormikHelpers } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNotifications } from "@toolpad/core";

import UpdatePassword from "../UpdatePassword";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { RootState } from "../../services/redux/rootReducer";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const initialValues: FormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .min(6, "Too Short!")
    .max(50, "Too Long!")
    .required("Confirm password is required")
    .equals([Yup.ref("newPassword")], "Password does not match"),
}) as Yup.ObjectSchema<FormValues>;

const UpdatePasswordCtrl = () => {
  const { userId, email } = useSelector((state: RootState) => {
    const user = state.user.connectedUser;
    return { userId: user?._id || "", email: user?.email || "" };
  }, shallowEqual);
  const dispatch = useDispatch();
  const notifications = useNotifications();

  const onSubmit = useCallback(
    (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      const usersSrv = new UsersSrv(dispatch);
      const { error } = usersSrv.updatePassword({
        userId,
        email,
        password: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (error) {
        notifications.show(error.publicMessage, {
          autoHideDuration: 5000,
          severity: "error",
        });
        return;
      }
      helpers.resetForm();
    },
    [dispatch, userId, email, notifications]
  );

  return (
    <UpdatePassword
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
};

export default UpdatePasswordCtrl;
