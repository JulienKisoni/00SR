import React, { useCallback, useState } from "react";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useNotifications } from "@toolpad/core";

import ImagePicker from "../../ImagePicker";
import StoreForm from "../../forms/StoreForm";
import { GenericError } from "../../../classes/GenericError";
import { RootState } from "../../../services/redux/rootReducer";
import { StoreSrv } from "../../../services/controllers/StoreSrv";
import { Store } from "../../../classes/Store";
import { ROUTES } from "../../../constants/routes";

interface FormValues {
  line1: string;
  line2?: string;
  country: string;
  state: string;
  city: string;
  name: string;
  description: string;
}
const validationSchema = Yup.object<FormValues>().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string()
    .required("Description is required")
    .min(6, "Too short")
    .max(150, "Too long"),
  line1: Yup.string().required("Line 1 is required"),
  line2: Yup.string(),
  country: Yup.string().required("State is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
});

const STATES = [
  { value: "Alberta", label: "Alberta" },
  { value: "Colombie-Britannique", label: "Colombie-Britannique" },
  { value: "Manitoba", label: "Manitoba" },
  { value: "Nouveau-Brunswick", label: "Nouveau-Brunswick" },
  { value: "Terre-Neuve-et-Labrador", label: "Terre-Neuve-et-Labrador" },
  { value: "Nouvelle-Écosse", label: "Nouvelle-Écosse" },
  { value: "Ontario", label: "Ontario" },
  { value: "Île-du-Prince-Édouard", label: "Île-du-Prince-Édouard" },
  { value: "Québec", label: "Québec" },
  { value: "Saskatchewan", label: "Saskatchewan" },
  { value: "Territoires du Nord-Ouest", label: "Territoires du Nord-Ouest" },
  { value: "Nunavut", label: "Nunavut" },
  { value: "Yukon", label: "Yukon" },
];

interface Props {
  initialValues: FormValues;
  mode?: Types.FormMode;
  defaultImgSrc: string;
  onDeleteStore?: () => void;
  storeId: string;
}

const StoreFormCtlr = ({
  mode = "add",
  initialValues,
  defaultImgSrc = "",
  onDeleteStore,
  storeId = "",
}: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);

  const [state, setState] = useState({ picture: "" });

  const onSubmit = useCallback(
    async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (!connectedUser) {
        alert("No connected user");
        return;
      }
      const newStore = new Store({
        values,
        owner: connectedUser._id,
        picture: state.picture,
        id: storeId,
      });
      const storeSrv = new StoreSrv(dispatch);
      if (mode === "add") {
        const payload = newStore.toObject();
        storeSrv.addOne<Types.IStoreDocument>(payload);
        helpers.resetForm();
        await helpers.validateForm();
        notifications.show("Store created", {
          severity: "success",
          autoHideDuration: 5000,
        });
        navigate(`/${ROUTES.STORES}`, { replace: true });
      } else if (mode === "edit") {
        const oldStore = new Store({
          values: initialValues,
          owner: connectedUser._id,
          picture: defaultImgSrc,
          id: storeId,
        }).toObject();
        const payload = newStore.compareWithOld(oldStore);
        storeSrv.updateOne(storeId, payload);
        helpers.resetForm({ values });
        await helpers.validateForm();
        alert("Store updated");
      }
    },
    [
      state,
      connectedUser,
      dispatch,
      mode,
      initialValues,
      storeId,
      defaultImgSrc,
      navigate,
      notifications,
    ]
  );
  const onFileUploadError = useCallback((error: GenericError) => {
    alert(error.publicMessage);
  }, []);
  const onFileUploadSuccess = useCallback(
    ({ downloadURL }: { downloadURL: string }) => {
      setState((prev) => ({ ...prev, picture: downloadURL }));
    },
    []
  );

  return (
    <div>
      <ImagePicker
        alt="store"
        defaultSrc={defaultImgSrc}
        onError={onFileUploadError}
        onSuccess={onFileUploadSuccess}
        disabled={mode === "readonly"}
      />
      <StoreForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        states={STATES}
        mode={mode}
        onDeleteStore={onDeleteStore}
      />
    </div>
  );
};

export default StoreFormCtlr;
