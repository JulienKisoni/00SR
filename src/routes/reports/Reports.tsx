import React, { useState, useCallback, useMemo } from "react";
import Grid from "@mui/system/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type {
  GridColDef,
  GridRowIdGetter,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import SearchBar from "../../components/SearchBar";
import ListTable from "../../components/ListTable";
import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import { ReportSrv } from "../../services/controllers/ReportSrv";
import { inputGridSystem } from "../../constants";

interface State {
  search: string;
  selectedReportIDs: string[];
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "description",
    headerName: "Description",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    type: "date",
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (value: string) => new Date(value),
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "totalItems",
    headerName: "# Items",
    type: "number",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "orders",
    headerName: "Total orders",
    valueGetter: (orders: Types.IReportDocument[]) => orders.length,
    type: "number",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "totalPrices",
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

function Reports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiRef = useGridApiRef();

  const reportSrv = useMemo(() => new ReportSrv(dispatch), [dispatch]);

  const [state, setState] = useState<State>({
    search: "",
    selectedReportIDs: [],
  });
  const connectedUserId = useSelector((state: RootState) => {
    return state.user.connectedUser?._id;
  }, shallowEqual);
  const selectedStoreId = useSelector((state: RootState) => {
    return state.user.selectedStore?._id;
  }, shallowEqual);
  const reports: Types.IReportDocument[] = useSelector((state: RootState) => {
    if (!selectedStoreId || !connectedUserId) {
      return [];
    }
    return state.reports.filter((report) => report.storeId === selectedStoreId);
  }, shallowEqual);

  const transformedReports: Types.IReportDocument[] = useMemo(() => {
    const tempReports = reports.map((_report) => {
      let allOrderItems: Types.CartItem[] = [];
      _report.orders.forEach((ord) => {
        allOrderItems = [...allOrderItems, ...ord.items];
      });
      return {
        ..._report,
        allOrderItems,
      };
    });
    return tempReports.map((report) => {
      return {
        ...report,
        totalItems: report.allOrderItems?.length,
        totalPrices: report.allOrderItems
          .map((item) => item.totalPrice || 0)
          .reduce((a: number, b: number) => a + b, 0),
        allOrderItems: undefined,
      };
    });
  }, [reports]);
  const filteredReports: Types.IReportDocument[] = useMemo(() => {
    if (!state.search) {
      return transformedReports;
    }
    return transformedReports.filter((item) =>
      item.name.toLowerCase().includes(state.search.toLowerCase())
    );
  }, [transformedReports, state.search]);

  const handleEndTyping = useCallback((value: string) => {
    setState((prev) => ({ ...prev, search: value }));
  }, []);

  const onRowSelectionModelChange = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      const IDs = rowSelectionModel.map((rowId) => rowId.toString());
      setState((prev) => ({ ...prev, selectedReportIDs: IDs }));
    },
    []
  );

  const handleDeleteItems = useCallback(() => {
    if (state.selectedReportIDs.length && selectedStoreId && connectedUserId) {
      reportSrv.deleteMany(state.selectedReportIDs);
    }
  }, [state.selectedReportIDs, selectedStoreId, connectedUserId, reportSrv]);
  const handleDownloadReports = useCallback(() => {
    if (
      !connectedUserId ||
      !selectedStoreId ||
      !state.selectedReportIDs.length
    ) {
      return;
    }
    // TODO: download a maximum of 4 reports
    /* const tempTargetedOrders: Types.IReportDocument[] = filteredReports.filter(
      (order) => state.selectedReportIDs.includes(order._id)
    );
    try {
      const payload: string = JSON.stringify(tempTargetedOrders);
      localStorage.setItem("tempTargetedOrders", payload);
      navigate(`/${ROUTES.REPORTS}/add`);
    } catch (err: any) {
      const error = new GenericError(
        err.message || err.reason || "Something went wrong"
      );
      alert(error.message);
    } finally {
      apiRef.current.setRowSelectionModel([]);
    } */
  }, [selectedStoreId, connectedUserId, state.selectedReportIDs]);
  const getRowId: GridRowIdGetter<Types.IReportDocument> | undefined =
    useCallback((row: Types.IReportDocument) => {
      return row._id;
    }, []);
  const handleSingleDelete = useCallback(
    (reportId: string | number) => {
      const report = filteredReports.find(
        (_report) => _report._id === reportId.toString()
      );
      if (report) {
        const message = `Are you sure you wanna delete this report (${report.name})?`;
        // eslint-disable-next-line no-restricted-globals
        const agree = confirm(message);
        if (agree) {
          const { error } = reportSrv.deleteOne(reportId.toString());
          if (error) {
            alert(error.publicMessage);
          }
        }
      }
    },
    [reportSrv, filteredReports]
  );
  const handleViewReport = useCallback(
    (reportId: string | number) => {
      navigate(`/${ROUTES.REPORTS}/${reportId}`);
    },
    [navigate]
  );
  const handleEditReport = useCallback(
    (reportId: string | number) => {
      navigate(`/${ROUTES.REPORTS}/${reportId}/edit`);
    },
    [navigate]
  );

  return (
    <Grid container direction={"column"} spacing={2}>
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="h3" component="h1">
          Reports
        </Typography>
        <Button
          disabled={!state.selectedReportIDs?.length}
          onClick={handleDownloadReports}
          variant="contained"
        >
          Download report(s)
        </Button>
      </Stack>
      <Stack direction="column">
        <Typography variant="subtitle1">
          Manage and download your reports
        </Typography>
      </Stack>
      <Grid container direction={"row"}>
        <Grid {...inputGridSystem}>
          <SearchBar
            fullWidth
            size="small"
            onEndTyping={handleEndTyping}
            placeholder="Search by name"
          />
        </Grid>
        <Grid {...inputGridSystem}>
          <Stack direction="row" justifyContent={"flex-end"}>
            <Button
              disabled={!state.selectedReportIDs?.length}
              onClick={handleDeleteItems}
              variant="contained"
            >
              Delete report(s)
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <ListTable
        rows={filteredReports}
        columns={columns}
        onDeleteClick={handleSingleDelete}
        onViewClick={handleViewReport}
        onEditClick={handleEditReport}
        onRowSelectionModelChange={onRowSelectionModelChange}
        apiRef={apiRef}
        getRowId={getRowId}
        sx={{
          maxWidth: "100vw",
          border: 0,
        }}
      />
    </Grid>
  );
}

export default Reports;
