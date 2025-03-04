import React, { useCallback, useMemo } from "react";
import * as Yup from "yup";
import { FormikHelpers } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { useNotifications } from "@toolpad/core";

import { UsersSrv } from "../../services/controllers/UserSrv";
import { RootState } from "../../services/redux/rootReducer";
import UpdateProfile from "../UpdateProfile";
import { regex } from "../../constants";
import ImagePicker from "../ImagePicker";
import { GenericError } from "../../classes/GenericError";

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
  const notifications = useNotifications();

  const initialValues = useMemo(() => {
    const data = {
      email: connectedUser?.email || "",
      username: connectedUser?.profile?.username || "",
    };
    return data;
  }, [connectedUser]);

  const onFileUploadError = useCallback(
    (error: GenericError) => {
      notifications.show(error.publicMessage, {
        autoHideDuration: 5000,
        severity: "error",
      });
    },
    [notifications]
  );
  const onFileUploadSuccess = useCallback(
    ({ downloadURL }: { downloadURL: string }) => {
      if (!connectedUser) {
        notifications.show("No connected user", {
          autoHideDuration: 5000,
          severity: "error",
        });
        return;
      }
      notifications.show("Upload success", {
        autoHideDuration: 5000,
        severity: "success",
      });
      const usersSrv = new UsersSrv(dispatch);
      const userId = connectedUser?._id || "";
      const profile = connectedUser?.profile || {};
      const payload: Partial<Types.IUserDocument> = {
        profile: {
          ...profile,
          picture: downloadURL,
        },
      };
      usersSrv.updateOne(userId, payload);
    },
    [dispatch, connectedUser, notifications]
  );

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
          notifications.show(error.publicMessage, {
            autoHideDuration: 5000,
            severity: "error",
          });
          return;
        }
        notifications.show("Profile updated successfully", {
          autoHideDuration: 5000,
          severity: "success",
        });
        helpers.resetForm({ values });
      }
    },
    [dispatch, connectedUser, notifications]
  );
  const handleRemovePicture = useCallback(() => {
    if (!connectedUser) {
      notifications.show("No connected user", {
        autoHideDuration: 5000,
        severity: "error",
      });
      return;
    }
    const usersSrv = new UsersSrv(dispatch);
    const userId = connectedUser?._id || "";
    const profile = connectedUser?.profile || {};
    const payload: Partial<Types.IUserDocument> = {
      profile: {
        ...profile,
        picture: "",
      },
    };
    usersSrv.updateOne(userId, payload);
    notifications.show("Picture removed successfully", {
      autoHideDuration: 5000,
      severity: "success",
    });
  }, [notifications, connectedUser, dispatch]);

  if (!connectedUser || !initialValues.email || !initialValues.username) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <div>
        <ImagePicker
          alt={connectedUser.profile.username}
          defaultSrc={connectedUser.profile.picture}
          onError={onFileUploadError}
          onSuccess={onFileUploadSuccess}
          disabled={false}
          allowTakePicture
          onRemovePicture={handleRemovePicture}
        />
        <UpdateProfile
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        />
      </div>
    </Box>
  );
};

export default UpdateProfileCtrl;
