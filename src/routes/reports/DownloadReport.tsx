import React, { useMemo, useEffect, useState, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useParams } from "react-router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";
import { Backdrop, CircularProgress } from "@mui/material";
import Grid from "@mui/system/Grid";
import { usePDF, Resolution, Margin, Options } from "react-to-pdf";

import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import NotFound from "../NotFound";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { StoreSrv } from "../../services/controllers/StoreSrv";
import OrderDetails from "../../components/OrderDetails";
import { centeredTableGridSystem } from "../../constants";
// const pfrWorker = require("../../services/workers/pdf");

interface FormValues {
  name: string;
  description: string;
}
type TransformedReport = Types.IReportDocument & { totalPrices: number };
interface SelectedOrder {
  orderNumber: string;
  orderOwnerName: string;
  createdAt: string;
  orderStoreName: string;
  totalPrice: number;
  items: Types.CartItem[];
}
const columns: GridColDef[] = [
  {
    field: "productName",
    headerName: "Product name",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "productDescription",
    headerName: "Product description",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "quantity",
    headerName: "Buy Qty",
    type: "number",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "productDetails",
    headerName: "Unit price",
    type: "number",
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (productDetails: Partial<Types.IProductDocument>) =>
      `${productDetails?.unitPrice}$`,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "totalPrice",
    headerName: "Total price",
    valueGetter: (key: number) => `${key}$`,
    type: "number",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
];

const DownloadReport = () => {
  const { reportId } = useParams();
  const dispatch = useDispatch();
  const [state, setState] = useState({ deny: false });
  const [worker, setWorker] = useState<Worker>();
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

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

  const onDownloadReport = useCallback(() => {
    if (state.deny) {
      alert("You do not have access to this report");
      return;
    } else if (
      loading ||
      !transformedReport?.orders?.length ||
      initialValues === null
    ) {
      console.log({
        loading,
        initialValues,
        length: transformedReport?.orders?.length,
      });
      alert("Something went wrong");
      return;
    }
    try {
      const options: Options = {
        method: "save",
        resolution: Resolution.MEDIUM,
        page: {
          // margin is in MM, default is Margin.NONE = 0
          margin: Margin.LARGE,
          format: "A4",
          orientation: "portrait",
        },
        canvas: {
          mimeType: "image/jpeg",
          qualityRatio: 1,
        },
      };
      toPDF(options);
      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (error) {
      console.log("Error ", error);
    }
  }, [toPDF, state.deny, transformedReport?.orders, initialValues, loading]);

  useEffect(() => {
    setTimeout(() => {
      console.log("called");
      onDownloadReport();
    }, 1500);
    // Create a new web worker
    // const myWorker: any = {};
    // // const myWorker = new Worker(pfrWorker);
    // // Set up event listener for messages from the worker
    // myWorker.onmessage = function (event: any) {
    //   console.log("Received result from worker:", event.data);
    // };
    // // Save the worker instance to state
    // setWorker(myWorker);
    // // Clean up the worker when the component unmounts
    // return () => {
    //   myWorker.terminate();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRowId: GridRowIdGetter<Types.CartItem> | undefined = useCallback(
    (row: Types.CartItem) => {
      return row.productId;
    },
    []
  );
  const renderOrderDetails = useCallback(
    (orders: Types.IOrderDocument[]) => {
      return orders.map((order) => {
        const { data: userData } = usersSrv.getOne<Types.IUserDocument>({
          _id: order.owner,
        });
        const { data: storeData } = storesSrv.getOne<Types.IStoreDocument>({
          _id: order.storeId,
        });
        if (
          !storeData?.name ||
          !userData?.profile?.username ||
          !order.createdAt
        ) {
          return null;
        }
        const items = order.items.map((item) => {
          return {
            ...item,
            productName: item.productDetails?.name,
            productDescription: item.productDetails?.description,
          };
        });
        const selectedOrder: SelectedOrder = {
          orderNumber: order.orderNumber,
          orderOwnerName: userData?.profile.username,
          orderStoreName: storeData?.name,
          createdAt: order.createdAt,
          totalPrice: order.totalPrice,
          items,
        };
        return (
          <Grid key={order._id} direction="row" {...centeredTableGridSystem}>
            <OrderDetails
              variant="small"
              getRowId={getRowId}
              columns={columns}
              selectedOrder={selectedOrder}
              ordersPagination={undefined}
              listSx={{ border: 0, maxWidth: "70vw" }}
            />
          </Grid>
        );
      });
    },
    [usersSrv, storesSrv, getRowId]
  );

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
    <Stack paddingX={5} paddingY={5} ref={targetRef} direction="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant="h3" component="h1">
          {report?.name}
        </Typography>
      </Stack>
      <Typography mt={2} variant="subtitle1">
        View details about your report
      </Typography>
      <Typography mt={2} variant="subtitle1">
        Requested by: {reportOwnerName}
      </Typography>
      <Typography variant="subtitle1">
        Generated at: {report?.createdAt}
      </Typography>
      <Typography variant="subtitle1">Store: {reportStoreName}</Typography>
      <Typography variant="subtitle1">
        Total price: {`${transformedReport?.totalPrices}$`}
      </Typography>
      <Typography variant="subtitle1">
        Description: {report?.description}
      </Typography>
      <Typography mt={2} variant="subtitle1" sx={{ fontWeight: "bold" }}>
        ORDERS DETAILS
      </Typography>
      <Grid mt={7} container direction="column">
        {renderOrderDetails(transformedReport?.orders || [])}
      </Grid>
    </Stack>
  );
};

export default DownloadReport;
