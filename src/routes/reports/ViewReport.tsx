import React, { useMemo, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useParams } from "react-router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import NotFound from "../NotFound";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { StoreSrv } from "../../services/controllers/StoreSrv";

interface FormValues {
  name: string;
  description: string;
}
type TransformedReport = Types.IReportDocument & { totalPrices: number };

const ViewReport = () => {
  const { reportId } = useParams();
  const dispatch = useDispatch();
  const [state, setState] = useState({ deny: false });

  const report = useSelector((state: RootState) => {
    return state.reports.find((_report) => _report._id === reportId);
  }, shallowEqual);
  const selectedStore = useSelector((state: RootState) => {
    return state.user.selectedStore;
  }, shallowEqual);
  const connectedUser = useSelector((state: RootState) => {
    return state.user.connectedUser;
  }, shallowEqual);

  const transformedReport: TransformedReport | undefined = useMemo(() => {
    if (!report) {
      return undefined;
    }
    let allOrderItems: Types.CartItem[] = [];
    report?.orders.forEach((ord) => {
      allOrderItems = [...allOrderItems, ...ord.items];
    });
    return {
      ...report,
      totalPrices: allOrderItems
        .map((item) => item.totalPrice || 0)
        .reduce((a: number, b: number) => a + b, 0),
      allOrderItems: undefined,
    };
  }, [report]);
  const usersSrv = useMemo(() => new UsersSrv(dispatch), [dispatch]);
  const storesSrv = useMemo(() => new StoreSrv(dispatch), [dispatch]);
  const loading = useMemo(() => {
    if (!report || !selectedStore || !connectedUser) {
      return true;
    }
    return false;
  }, [report, selectedStore, connectedUser]);
  const reportOwnerName = useMemo(() => {
    if (!connectedUser || !report) {
      return null;
    }
    const { error, data } = usersSrv.getOne<Types.IUserDocument>({
      _id: report.owner,
    });
    if (error) {
      return null;
    } else if (data) {
      return data.profile.username;
    } else {
      return null;
    }
  }, [report, connectedUser, usersSrv]);
  const reportStoreName = useMemo(() => {
    if (!connectedUser || !report) {
      return null;
    }
    const { error, data } = storesSrv.getOne<Types.IStoreDocument>({
      _id: report.storeId,
    });
    if (error) {
      return null;
    } else if (data) {
      return data.name;
    } else {
      return null;
    }
  }, [report, connectedUser, storesSrv]);

  useEffect(() => {
    if (connectedUser?._id && report?._id) {
      if (connectedUser._id !== report.owner) {
        alert("You do not have access to this report");
        setState((prev) => ({ ...prev, deny: true }));
      }
    }
  }, [connectedUser, report]);

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

  if (initialValues === null) {
    return <NotFound />;
  }
  if (loading) {
    return (
      <Container>
        <div>Loading</div>
      </Container>
    );
  } else if (state.deny) {
    return <Navigate to={`/${ROUTES.REPORTS}`} replace />;
  }

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Typography variant="h3" component="h1">
          {report?.name}
        </Typography>
        <Typography variant="subtitle2">
          View details about your report
        </Typography>
        <Typography variant="subtitle2">
          Requested by: {reportOwnerName}
        </Typography>
        <Typography variant="subtitle2">
          Generated at: {report?.createdAt}
        </Typography>
        <Typography variant="subtitle2">Store: {reportStoreName}</Typography>
        <Typography variant="subtitle2">
          Total price: {`${transformedReport?.totalPrices}$`}
        </Typography>
        <Typography variant="subtitle2">
          Description: {report?.description}
        </Typography>
        <Typography variant="subtitle2">ORDERS DETAILS</Typography>
      </Stack>
    </Container>
  );
};

export default ViewReport;
