import React, { useCallback, useState } from "react";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import ImagePicker from "../../ImagePicker";
import StoreForm from "../../forms/StoreForm";
import { GenericError } from "../../../classes/GenericError";
import { RootState } from "../../../services/redux/rootReducer";
import { StoreSrv } from "../../../services/controllers/StoreSrv";

interface FormValues {
  line1: string;
  line2?: string;
  country: string;
  state: string;
  city: string;
  name: string;
  description: string;
}
const initialValues: FormValues = {
  line1: "",
  line2: "",
  country: "Canada",
  state: "",
  city: "",
  name: "",
  description: "",
};
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

const StoreFormCtlr = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      const payload: Types.IStoreDocument = {
        _id: "",
        name: values.name,
        owner: connectedUser._id,
        products: [],
        description: values.description,
        active: true,
        picture: state.picture,
        address: {
          line1: values.line1,
          line2: values.line2,
          country: values.country,
          state: values.state,
          city: values.city,
        },
      };
      const storeSrv = new StoreSrv(dispatch);
      storeSrv.addOne<Types.IStoreDocument>(payload);
      helpers.resetForm();
      await helpers.validateForm();
      alert("Store created");
    },
    [state, connectedUser, dispatch]
  );
  const onFileUploadError = useCallback((error: GenericError) => {
    alert(error.publicMessage);
  }, []);
  const onFileUploadSuccess = useCallback(
    ({ downloadURL }: { downloadURL: string }) => {
      console.log({ downloadURL });
      setState((prev) => ({ ...prev, picture: downloadURL }));
    },
    []
  );

  return (
    <div>
      <ImagePicker
        alt="store"
        defaultSrc=""
        onError={onFileUploadError}
        onSuccess={onFileUploadSuccess}
      />
      <StoreForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        states={STATES}
      />
    </div>
  );
};

export default StoreFormCtlr;
