import React, { useState, useCallback, useMemo } from "react";
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
import Grid from "@mui/system/Grid";

import SearchBar from "../../components/SearchBar";
import ListTable from "../../components/ListTable";
import { OrderSrv } from "../../services/controllers/OrderSrv";
import { RootState } from "../../services/redux/rootReducer";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { ROUTES } from "../../constants/routes";
import { GenericError } from "../../classes/GenericError";
import { inputGridSystem } from "../../constants";

interface State {
  search: string;
  selectedOrderIDs: string[];
}

const columns: GridColDef[] = [
  {
    field: "orderNumber",
    headerName: "Order number",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
  },
  {
    field: "ownerDetails",
    headerName: "Ordered by",
    valueGetter: (ownerDetails: Partial<Types.IUserDocument>) => {
      return ownerDetails?.profile?.username || "";
    },
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
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
  },
  {
    field: "items",
    headerName: "# Items",
    valueGetter: (items: Types.CartItem[]) => items.length,
    type: "number",
    sortable: false,
    disableColumnMenu: true,
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

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiRef = useGridApiRef();

  const usersSrv = useMemo(() => new UsersSrv(dispatch), [dispatch]);
  const orderSrv = useMemo(() => new OrderSrv(dispatch), [dispatch]);

  const [state, setState] = useState<State>({
    search: "",
    selectedOrderIDs: [],
  });
  const connectedUserId = useSelector((state: RootState) => {
    return state.user.connectedUser?._id;
  }, shallowEqual);
  const selectedStoreId = useSelector((state: RootState) => {
    return state.user.selectedStore?._id;
  }, shallowEqual);
  const orders = useSelector((state: RootState) => {
    if (!selectedStoreId || !connectedUserId) {
      return [];
    }
    return state.orders.filter((order) => order.storeId === selectedStoreId);
  }, shallowEqual);

  const transformedOrders: Types.IOrderDocument[] = useMemo(() => {
    return orders.map((_order) => {
      const { data } = usersSrv.getOne<Types.IUserDocument>({
        _id: _order.owner,
      });
      if (data) {
        const ownerDetails: Partial<Types.IUserDocument> = {
          profile: data.profile,
        };
        return {
          ..._order,
          ownerDetails,
        };
      }
      return _order;
    });
  }, [orders, usersSrv]);
  const filteredOrders: Types.IOrderDocument[] = useMemo(() => {
    if (!state.search) {
      return transformedOrders;
    }
    return transformedOrders.filter((item) =>
      item.orderNumber.toLowerCase().includes(state.search.toLowerCase())
    );
  }, [transformedOrders, state.search]);

  const handleEndTyping = useCallback((value: string) => {
    setState((prev) => ({ ...prev, search: value }));
  }, []);

  const onRowSelectionModelChange = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      const IDs = rowSelectionModel.map((rowId) => rowId.toString());
      setState((prev) => ({ ...prev, selectedOrderIDs: IDs }));
    },
    []
  );

  const handleDeleteItems = useCallback(() => {
    if (state.selectedOrderIDs.length && selectedStoreId && connectedUserId) {
      orderSrv.deleteMany(state.selectedOrderIDs);
    }
  }, [state.selectedOrderIDs, selectedStoreId, connectedUserId, orderSrv]);
  const handleGenerateReport = useCallback(() => {
    if (
      !connectedUserId ||
      !selectedStoreId ||
      !state.selectedOrderIDs.length
    ) {
      return;
    }
    const tempTargetedOrders: Types.IOrderDocument[] = filteredOrders.filter(
      (order) => state.selectedOrderIDs.includes(order._id)
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
    }
  }, [
    selectedStoreId,
    connectedUserId,
    apiRef,
    state.selectedOrderIDs,
    filteredOrders,
    navigate,
  ]);
  const getRowId: GridRowIdGetter<Types.IOrderDocument> | undefined =
    useCallback((row: Types.IOrderDocument) => {
      return row._id;
    }, []);
  const handleSingleDelete = useCallback(
    (orderId: string | number) => {
      const order = filteredOrders.find(
        (_order) => _order._id === orderId.toString()
      );
      if (order) {
        const message = `Are you sure you wanna delete this order (${order.orderNumber})?`;
        // eslint-disable-next-line no-restricted-globals
        const agree = confirm(message);
        if (agree) {
          const { error } = orderSrv.deleteOne(orderId.toString());
          if (error) {
            alert(error.publicMessage);
          }
        }
      }
    },
    [orderSrv, filteredOrders]
  );
  const handleViewOrder = useCallback(
    (orderId: string | number) => {
      navigate(`/${ROUTES.ORDERS}/${orderId}`);
    },
    [navigate]
  );

  return (
    <Grid container direction={"column"} spacing={2}>
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="h3" component="h1">
          Order summaries
        </Typography>
        <Button
          disabled={!state.selectedOrderIDs?.length}
          onClick={handleGenerateReport}
          variant="contained"
        >
          Generate report
        </Button>
      </Stack>
      <Stack direction="column">
        <Typography variant="subtitle1">
          Manage your order summaries and generate reports
        </Typography>
      </Stack>
      <Grid direction="row" container>
        <Grid {...inputGridSystem}>
          <SearchBar
            onEndTyping={handleEndTyping}
            placeholder="Search by order number"
            size="small"
            fullWidth
          />
        </Grid>
        <Grid {...inputGridSystem}>
          <Stack direction="row" justifyContent={"flex-end"}>
            <Button
              disabled={!state.selectedOrderIDs?.length}
              onClick={handleDeleteItems}
              variant="contained"
              color="error"
            >
              Delete orders(s)
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <ListTable
        rows={filteredOrders}
        columns={columns}
        onDeleteClick={handleSingleDelete}
        onViewClick={handleViewOrder}
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

export default Orders;
