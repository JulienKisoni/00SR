import React, { useCallback, memo } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import type { FormikHelpers } from "formik";
import { useNavigate } from "react-router";
import { useNotifications } from "@toolpad/core";

import ForgotPassword from "../../routes/ForgotPassword";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { ROUTES } from "../../constants/routes";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const onSubmit = useCallback(
    async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      const usersSrv = new UsersSrv(dispatch);
      const { error } = await usersSrv.recoverPassword(values);
      if (error) {
        notifications.show(error.publicMessage, {
          severity: "error",
          autoHideDuration: 5000,
        });
      } else {
        helpers.resetForm({ values: { email: "" } });
        navigate(`/${ROUTES.SIGNIN}`);
        notifications.show("Email sent", {
          severity: "success",
          autoHideDuration: 5000,
        });
      }
    },
    [dispatch, navigate, notifications]
  );
  return (
    <ForgotPassword
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
};

export default memo(ForgotPasswordCtrl);
