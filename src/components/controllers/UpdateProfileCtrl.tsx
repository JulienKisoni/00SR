import React, { useCallback, useMemo } from "react";
import * as Yup from "yup";
import { FormikHelpers } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { UsersSrv } from "../../services/controllers/UserSrv";
import { RootState } from "../../services/redux/rootReducer";
import UpdateProfile from "../UpdateProfile";
import { regex } from "../../constants";

interface FormValues {
  username: string;
  email: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email")
    .matches(regex.email, "Invalid email format")
    .required("Email is required"),
}) as Yup.ObjectSchema<FormValues>;

const UpdateProfileCtrl = () => {
  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);
  const dispatch = useDispatch();

  const initialValues = useMemo(() => {
    const data = {
      email: connectedUser?.email || "",
      username: connectedUser?.profile?.username || "",
    };
    return data;
  }, [connectedUser]);

  const onSubmit = useCallback(
    (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (connectedUser) {
        const { _id, profile } = connectedUser || {};
        const userId = _id || "";
        const payload: Partial<Types.IUserDocument> = {
          email: values.email,
          profile: {
            ...profile,
            username: values.username,
          },
        };
        const usersSrv = new UsersSrv(dispatch);
        const { error } = usersSrv.updateOne(userId, payload);
        if (error) {
          alert(error.publicMessage);
          return;
        }
        helpers.resetForm({ values });
      }
    },
    [dispatch, connectedUser]
  );

  if (!connectedUser || !initialValues.email || !initialValues.username) {
    return <div>Loading...</div>;
  }

  return (
    <UpdateProfile
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    />
  );
};

export default UpdateProfileCtrl;
