import React, { useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router";

import { OrderSrv } from "../../services/controllers/OrderSrv";
import { RootState } from "../../services/redux/rootReducer";
import { UsersSrv } from "../../services/controllers/UserSrv";
import { ROUTES } from "../../constants/routes";
import { StoreSrv } from "../../services/controllers/StoreSrv";
import OrderDetails from "../../components/OrderDetails";

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
  const currentOrder = useSelector((state: RootState) => {
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
    if (!currentOrder) {
      return [];
    }
    return currentOrder.items.map((item) => {
      return {
        ...item,
        productName: item.productDetails?.name,
        productDescription: item.productDetails?.description,
      };
    });
  }, [currentOrder]);
  const orderOwnerName = useMemo(() => {
    if (!connectedUserId || !currentOrder) {
      return null;
    }
    const { error, data } = usersSrv.getOne<Types.IUserDocument>({
      _id: currentOrder.owner,
    });
    if (error) {
      return null;
    } else if (data) {
      return data.profile.username;
    } else {
      return null;
    }
  }, [currentOrder, connectedUserId, usersSrv]);
  const orderStoreName = useMemo(() => {
    if (!connectedUserId || !currentOrder) {
      return null;
    }
    const { error, data } = storesSrv.getOne<Types.IStoreDocument>({
      _id: currentOrder.storeId,
    });
    if (error) {
      return null;
    } else if (data) {
      return data.name;
    } else {
      return null;
    }
  }, [currentOrder, connectedUserId, storesSrv]);
  const selectedOrder: SelectedOrder = useMemo(() => {
    if (
      !currentOrder ||
      !currentOrder?.createdAt ||
      !orderOwnerName ||
      !orderStoreName
    ) {
      return {} as SelectedOrder;
    }
    return {
      orderNumber: currentOrder.orderNumber,
      orderOwnerName,
      orderStoreName,
      createdAt: currentOrder.createdAt,
      totalPrice: currentOrder.totalPrice,
      items: orderItems,
    };
  }, [orderItems, orderOwnerName, orderStoreName, currentOrder]);
  const getRowId: GridRowIdGetter<Types.CartItem> | undefined = useCallback(
    (row: Types.CartItem) => {
      return row.productId;
    },
    []
  );

  const handleDeleteOrder = useCallback(() => {
    if (currentOrder) {
      const message = `Are you sure you wanna delete this order (${currentOrder.orderNumber})?`;
      // eslint-disable-next-line no-restricted-globals
      const agree = confirm(message);
      if (agree) {
        const { error } = ordersSrv.deleteOne(currentOrder._id.toString());
        if (error) {
          alert(error.publicMessage);
        } else {
          navigate(`/${ROUTES.ORDERS}`);
        }
      }
    }
  }, [navigate, currentOrder, ordersSrv]);

  if (!currentOrder) {
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
      <OrderDetails
        subtitle="View details about your order"
        getRowId={getRowId}
        columns={columns}
        handleDeleteOrder={handleDeleteOrder}
        selectedOrder={selectedOrder}
        ordersPagination
      />
    </Container>
  );
}

export default ViewOrder;
