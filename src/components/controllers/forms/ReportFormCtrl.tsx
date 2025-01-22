import React, { useCallback, useMemo } from "react";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { RootState } from "../../../services/redux/rootReducer";
import { ROUTES } from "../../../constants/routes";
import ReportForm from "../../forms/ReportForm";
import { Report } from "../../../classes/Report";
import { ReportSrv } from "../../../services/controllers/ReportSrv";

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
  onDeleteReport?: () => void;
  reportId: string;
  orders: Types.IOrderDocument[];
  createdAt?: string;
}

const ReportFormCtrl = ({
  mode = "add",
  initialValues,
  onDeleteReport,
  reportId = "",
  orders,
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

  const reportSrv = useMemo(() => new ReportSrv(dispatch), [dispatch]);

  const onSubmit = useCallback(
    async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (!connectedUser) {
        alert("No connected user");
        return;
      } else if (!selectedStore) {
        alert("No selected store");
        return;
      }
      // TODO: create report with max 4 orders
      const newReport = new Report({
        ...values,
        userId: connectedUser._id,
        storeId: selectedStore._id,
        orders,
        reportId,
        createdAt,
      });

      if (mode === "add") {
        const payload = newReport.toObject();
        const { error } = reportSrv.addOne<Types.IReportDocument>(payload);
        if (error) {
          alert(error.publicMessage);
          return;
        } else {
          helpers.resetForm();
          await helpers.validateForm();
          alert("Report created");
          navigate(`/${ROUTES.REPORTS}`);
        }
      } else if (mode === "edit") {
        const payload = newReport.compareWithOld(initialValues);
        reportSrv.updateOne(reportId, payload);
        helpers.resetForm({ values });
        await helpers.validateForm();
        alert("Report updated");
      }
    },
    [
      connectedUser,
      mode,
      initialValues,
      selectedStore,
      navigate,
      createdAt,
      reportId,
      reportSrv,
      orders,
    ]
  );

  return (
    <div>
      <ReportForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        mode={mode}
        onDeleteReport={onDeleteReport}
      />
    </div>
  );
};

export default ReportFormCtrl;
