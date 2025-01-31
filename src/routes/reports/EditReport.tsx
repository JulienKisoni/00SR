import React, { useCallback, useEffect, useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useNavigate, useParams } from "react-router";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Backdrop, CircularProgress } from "@mui/material";

import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import NotFound from "../NotFound";
import ReportFormCtrl from "../../components/controllers/forms/ReportFormCtrl";
import { ReportSrv } from "../../services/controllers/ReportSrv";

interface FormValues {
  name: string;
  description: string;
}

const EditReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({ deny: false });

  const reportSrv = useMemo(() => new ReportSrv(dispatch), [dispatch]);

  const report = useSelector((state: RootState) => {
    return state.reports.find((_report) => _report._id === reportId);
  }, shallowEqual);
  const selectedStore = useSelector((state: RootState) => {
    return state.user.selectedStore;
  }, shallowEqual);
  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);

  const reportOrders: Types.IOrderDocument[] = useMemo(
    () => report?.orders || [],
    [report?.orders]
  );

  const loading = useMemo(() => {
    if (!report || !selectedStore || !connectedUser) {
      return true;
    }
    return false;
  }, [report, selectedStore, connectedUser]);

  useEffect(() => {
    const condition1 =
      connectedUser && report && connectedUser?._id !== report?.owner;
    const condition2 =
      report && selectedStore && report.storeId !== selectedStore._id;
    if (condition1 || condition2) {
      alert("You do not have access to this report");
      setState((prev) => ({ ...prev, deny: true }));
    }
  }, [selectedStore, report, connectedUser]);

  const initialValues: FormValues | null = useMemo(() => {
    if (!report) {
      return null;
    }
    const values: FormValues = {
      name: report.name,
      description: report.description,
    };
    return values;
  }, [report]);

  const handleDeleteReport = useCallback(() => {
    if (report) {
      const message = `Are you sure you wanna delete this report (${report.name})?`;
      // eslint-disable-next-line no-restricted-globals
      const agree = confirm(message);
      if (agree) {
        reportSrv.deleteOne(report._id);
        alert("Report deleted");
        navigate(`/${ROUTES.REPORTS}`, { replace: true });
      }
    }
  }, [report, reportSrv, navigate]);

  if (initialValues === null) {
    return <NotFound />;
  }
  if (loading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (state.deny) {
    return <Navigate to={`/${ROUTES.REPORTS}`} replace />;
  }

  return (
    <Stack direction="column">
      <Typography variant="h3" component="h1">
        {report?.name}
      </Typography>
      <Typography mt={2} variant="subtitle1">
        Update the name and/or the description of your report.
      </Typography>
      <Typography variant="subtitle1">
        You're about to edit a report of the following order(s):
      </Typography>
      {reportOrders.map((order, idx) => {
        const lastIndex = idx === reportOrders.length - 1;
        const mb = lastIndex ? 4 : 0;
        return (
          <Typography mb={mb} ml={3} key={order._id} variant="subtitle1">
            {`- Order #${order.orderNumber}`}
          </Typography>
        );
      })}
      <ReportFormCtrl
        mode="edit"
        initialValues={initialValues}
        onDeleteReport={handleDeleteReport}
        reportId={report?._id || ""}
        createdAt={report?.createdAt}
        orders={reportOrders}
      />
    </Stack>
  );
};

export default EditReport;
