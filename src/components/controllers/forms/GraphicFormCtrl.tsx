import React, { useCallback, useMemo } from "react";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { RootState } from "../../../services/redux/rootReducer";
import { ROUTES } from "../../../constants/routes";
import GraphicForm from "../../forms/GraphicForm";
import { GraphicSrv } from "../../../services/controllers/GraphicSrv";
import { Graphic } from "../../../classes/Graphic";

interface FormValues {
  name: string;
  description: string;
}

const validationSchema = Yup.object<FormValues>().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string()
    .required("Description is required")
    .min(6, "Too short")
    .max(250, "Too long"),
});

interface Props {
  initialValues: FormValues;
  mode?: Types.FormMode;
  onDeleteGraphic?: () => void;
  graphicId: string;
  products: Types.IHistoryDocument[];
  createdAt?: string;
}

const GraphicFormCtrl = ({
  mode = "add",
  initialValues,
  onDeleteGraphic,
  graphicId = "",
  products,
  createdAt,
}: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);
  const selectedStore = useSelector((state: RootState) => {
    return state.user.selectedStore;
  }, shallowEqual);

  const graphicSrv = useMemo(() => new GraphicSrv(dispatch), [dispatch]);

  const onSubmit = useCallback(
    async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (!connectedUser) {
        alert("No connected user");
        return;
      } else if (!selectedStore) {
        alert("No selected store");
        return;
      }
      // TODO: create report with max 4 products
      const newGraphic = new Graphic({
        ...values,
        userId: connectedUser._id,
        storeId: selectedStore._id,
        products,
        graphicId,
        createdAt,
      });

      if (mode === "add") {
        const payload = newGraphic.toObject();
        const { error } = graphicSrv.addOne<Types.IGraphicDocument>(payload);
        if (error) {
          alert(error.publicMessage);
          return;
        } else {
          localStorage.removeItem("tempTargetedProducts");
          helpers.resetForm();
          await helpers.validateForm();
          alert("Graphic created");
          navigate(`/${ROUTES.GRAPHICS}`, { replace: true });
        }
      } else if (mode === "edit") {
        const payload = newGraphic.compareWithOld(initialValues);
        graphicSrv.updateOne(graphicId, payload);
        helpers.resetForm({ values });
        await helpers.validateForm();
        alert("Graphic updated");
      }
    },
    [
      connectedUser,
      mode,
      initialValues,
      selectedStore,
      navigate,
      createdAt,
      graphicId,
      products,
      graphicSrv,
    ]
  );

  return (
    <div>
      <GraphicForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        mode={mode}
        onDeleteGraphic={onDeleteGraphic}
      />
    </div>
  );
};

export default GraphicFormCtrl;
