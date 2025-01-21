import React, { useState, useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
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
import { OrderSrv } from "../../services/controllers/OrderSrv";
import { RootState } from "../../services/redux/rootReducer";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { ROUTES } from "../../constants/routes";

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
  },
  {
    field: "ownerDetails",
    headerName: "Ordered by",
    valueGetter: (ownerDetails: Partial<Types.IUserDocument>) => {
      return ownerDetails?.profile?.username || "";
    },
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    type: "date",
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (value: string) => new Date(value),
  },
  {
    field: "items",
    headerName: "# Items",
    valueGetter: (items: Types.CartItem[]) => items.length,
    type: "number",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "totalPrice",
    headerName: "Total price",
    valueGetter: (key: number) => `${key}$`,
    type: "number",
    sortable: false,
    disableColumnMenu: true,
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

  const transformedOrders = useMemo(() => {
    return orders.map((_order) => {
      const { data } = usersSrv.getOne<Types.IUserDocument>({
        _id: _order.owner,
      });
      if (data) {
        return {
          ..._order,
          ownerDetails: {
            profile: {
              username: data.profile.username,
            },
          },
        };
      }
      return _order;
    });
  }, [orders, usersSrv]);
  const filteredOrders = useMemo(() => {
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
    if (!connectedUserId || !selectedStoreId) {
      return;
    }
    apiRef.current.setRowSelectionModel([]);
  }, [selectedStoreId, connectedUserId, apiRef]);
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
    <Container>
      <Stack spacing={2.5} direction="column">
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
          <Typography variant="subtitle2">
            Manage your order summaries and generate reports
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <SearchBar
            onEndTyping={handleEndTyping}
            placeholder="Search by order number"
          />
          <Stack direction="row">
            <Button
              disabled={!state.selectedOrderIDs?.length}
              onClick={handleDeleteItems}
              variant="contained"
            >
              Delete orders(s)
            </Button>
          </Stack>
        </Stack>
        <ListTable
          rows={filteredOrders}
          columns={columns}
          onDeleteClick={handleSingleDelete}
          onViewClick={handleViewOrder}
          onRowSelectionModelChange={onRowSelectionModelChange}
          apiRef={apiRef}
          getRowId={getRowId}
        />
      </Stack>
    </Container>
  );
}

export default Orders;
