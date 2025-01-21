import React, { useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router";

import ListTable from "../../components/ListTable";
import { OrderSrv } from "../../services/controllers/OrderSrv";
import { RootState } from "../../services/redux/rootReducer";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { ROUTES } from "../../constants/routes";
import { StoreSrv } from "../../services/controllers/StoreSrv";

const columns: GridColDef[] = [
  {
    field: "productName",
    headerName: "Product name",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "productDescription",
    headerName: "Product description",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "quantity",
    headerName: "Buy Qty",
    type: "number",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "productDetails",
    headerName: "Unit price",
    type: "number",
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (productDetails: Partial<Types.IProductDocument>) =>
      `${productDetails?.unitPrice}$`,
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

function ViewOrder() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const orderId = useMemo(() => params.orderId, [params.orderId]);

  const ordersSrv = useMemo(() => new OrderSrv(dispatch), [dispatch]);
  const usersSrv = useMemo(() => new UsersSrv(dispatch), [dispatch]);
  const storesSrv = useMemo(() => new StoreSrv(dispatch), [dispatch]);

  const connectedUserId = useSelector((state: RootState) => {
    return state.user.connectedUser?._id;
  }, shallowEqual);
  const selectedStoreId = useSelector((state: RootState) => {
    return state.user.selectedStore?._id;
  }, shallowEqual);
  const selectedOrder = useSelector((state: RootState) => {
    if (!selectedStoreId || !connectedUserId || !orderId) {
      return undefined;
    }
    return state.orders.find(
      (order) =>
        order.owner === connectedUserId &&
        order.storeId === selectedStoreId &&
        order._id === orderId
    );
  }, shallowEqual);

  const orderItems = useMemo(() => {
    if (!selectedOrder) {
      return [];
    }
    return selectedOrder.items.map((item) => {
      return {
        ...item,
        productName: item.productDetails?.name,
        productDescription: item.productDetails?.description,
      };
    });
  }, [selectedOrder]);
  const orderOwnerName = useMemo(() => {
    if (!connectedUserId || !selectedOrder) {
      return null;
    }
    const { error, data } = usersSrv.getOne<Types.IUserDocument>({
      _id: selectedOrder.owner,
    });
    if (error) {
      return null;
    } else if (data) {
      return data.profile.username;
    } else {
      return null;
    }
  }, [selectedOrder, connectedUserId, usersSrv]);
  const orderStoreName = useMemo(() => {
    if (!connectedUserId || !selectedOrder) {
      return null;
    }
    const { error, data } = storesSrv.getOne<Types.IStoreDocument>({
      _id: selectedOrder.storeId,
    });
    if (error) {
      return null;
    } else if (data) {
      return data.name;
    } else {
      return null;
    }
  }, [selectedOrder, connectedUserId, storesSrv]);
  const getRowId: GridRowIdGetter<Types.CartItem> | undefined = useCallback(
    (row: Types.CartItem) => {
      return row.productId;
    },
    []
  );
  const handleDeleteOrder = useCallback(() => {
    if (selectedOrder) {
      const message = `Are you sure you wanna delete this order (${selectedOrder.orderNumber})?`;
      // eslint-disable-next-line no-restricted-globals
      const agree = confirm(message);
      if (agree) {
        const { error } = ordersSrv.deleteOne(selectedOrder._id.toString());
        if (error) {
          alert(error.publicMessage);
        } else {
          navigate(`/${ROUTES.ORDERS}`);
        }
      }
    }
  }, [navigate, selectedOrder, ordersSrv]);

  if (!selectedOrder) {
    return (
      <Container>
        <Typography variant="h3" component="h1">
          Sorry, this order does not exist
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Stack justifyContent="space-between" direction="row">
          <Typography variant="h3" component="h1">
            Order {`#${selectedOrder.orderNumber}`}
          </Typography>
          <Button onClick={handleDeleteOrder} variant="contained">
            Delete order
          </Button>
        </Stack>
        <Stack direction="column">
          <Typography variant="subtitle2">
            View details about your order
          </Typography>
          <Typography variant="subtitle2">
            Ordered by: {orderOwnerName}
          </Typography>
          <Typography variant="subtitle2">
            Ordered at: {selectedOrder.createdAt}
          </Typography>
          <Typography variant="subtitle2">Store: {orderStoreName}</Typography>
          <Typography variant="subtitle2">
            Total price: {`${selectedOrder.totalPrice}$`}
          </Typography>
          <Typography variant="subtitle2">ITEMS DETAILS</Typography>
        </Stack>
        <ListTable
          rows={orderItems}
          columns={columns}
          getRowId={getRowId}
          hideActions
          checkboxSelection={false}
        />
      </Stack>
    </Container>
  );
}

export default ViewOrder;
