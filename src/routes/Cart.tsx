import React, { useState, useCallback, useMemo, memo } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowIdGetter,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import debounce from "lodash.debounce";
import Grid from "@mui/system/Grid";
import { useConfirm } from "material-ui-confirm";
import { useNotifications } from "@toolpad/core";

import SearchBar from "../components/SearchBar";
import ListTable from "../components/ListTable";
import { RootState } from "../services/redux/rootReducer";
import { CartSrv } from "../services/controllers/CartSrv";
import { OrderSrv } from "../services/controllers/OrderSrv";
import { Order } from "../classes/Order";
import { inputGridSystem } from "../constants";
import { InputBase } from "@mui/material";

interface State {
  search: string;
  selectedProductIDs: string[];
}
interface BuyQtyProps extends GridRenderCellParams {
  storeId: string;
  userId: string;
}

const BuyQty = memo((props: BuyQtyProps) => {
  const { row, storeId, userId } = props;

  const dispatch = useDispatch();
  const notifications = useNotifications();

  const [state, setState] = useState({ value: row.quantity });
  const cartSrv = useMemo(() => new CartSrv(dispatch), [dispatch]);

  const onEndTyping = useCallback(
    (value: string) => {
      const { productId } = row;
      const { error } = cartSrv.updateQty({
        storeId,
        userId,
        qty: parseInt(value),
        productId,
      });
      if (error) {
        notifications.show(error.publicMessage, {
          severity: "success",
          autoHideDuration: 5000,
        });
      } else {
        notifications.show(`${row.productName} updated inside the cart`, {
          severity: "success",
          autoHideDuration: 5000,
        });
      }
    },
    [cartSrv, storeId, userId, row, notifications]
  );
  const debouncedEndTyping = useMemo(
    () => debounce(onEndTyping, 1000),
    [onEndTyping]
  );
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      const num = parseInt(value, 10);
      if (num <= 0 || isNaN(num)) {
        notifications.show("Invalid value", {
          severity: "success",
          autoHideDuration: 5000,
        });
        return;
      }
      setState((prev) => ({ ...prev, value }));
      // Call API
      debouncedEndTyping(value);
    },
    [debouncedEndTyping, notifications]
  );

  return (
    <InputBase
      id="buyQty"
      name="name"
      value={state.value}
      type="number"
      onChange={handleChange}
      size="small"
      inputProps={{
        "data-testid": `buy-quantity-${row.productId}`,
      }}
    />
  );
});

function Cart() {
  const dispatch = useDispatch();

  const apiRef = useGridApiRef();
  const confirm = useConfirm();
  const notification = useNotifications();

  const cartSrv = useMemo(() => new CartSrv(dispatch), [dispatch]);
  const orderSrv = useMemo(() => new OrderSrv(dispatch), [dispatch]);

  const [state, setState] = useState<State>({
    search: "",
    selectedProductIDs: [],
  });
  const connectedUserId = useSelector((state: RootState) => {
    return state.user.connectedUser?._id;
  }, shallowEqual);
  const selectedStoreId = useSelector((state: RootState) => {
    return state.user.selectedStore?._id;
  }, shallowEqual);
  const currentCart = useSelector((state: RootState) => {
    if (!selectedStoreId || !connectedUserId) {
      return undefined;
    }
    return state.cart[connectedUserId][selectedStoreId];
  }, shallowEqual);

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "productName",
        headerName: "Product name",
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        align: "left",
      },
      {
        field: "productDescription",
        headerName: "Product description",
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        align: "left",
      },
      {
        field: "quantity",
        headerName: "Buy Qty",
        type: "number",
        sortable: false,
        disableColumnMenu: true,
        headerAlign: "left",
        renderCell: (params) => {
          return (
            <BuyQty
              {...params}
              storeId={selectedStoreId || ""}
              userId={connectedUserId || ""}
            />
          );
        },
      },
      {
        field: "productDetails",
        headerName: "Unit price",
        valueGetter: (productDetails: Partial<Types.IProductDocument>) =>
          `${productDetails?.unitPrice}$`,
        type: "number",
        flex: 1,
        align: "left",
        headerAlign: "left",
        sortable: false,
        disableColumnMenu: true,
      },
      {
        field: "totalPrice",
        headerName: "Total price",
        valueGetter: (key: number) => `${key}$`,
        type: "number",
        flex: 1,
        align: "left",
        headerAlign: "left",
        sortable: false,
        disableColumnMenu: true,
      },
    ];
  }, [selectedStoreId, connectedUserId]);

  const cartItems = useMemo(() => {
    return (
      currentCart?.items?.map((item) => {
        return {
          ...item,
          productName: item.productDetails?.name,
          productDescription: item.productDetails?.description,
        };
      }) || []
    );
  }, [currentCart]);

  const filteredProducts = useMemo(() => {
    if (!state.search) {
      return cartItems;
    }
    return cartItems.filter(
      (item) =>
        item.productDetails?.name &&
        item.productDetails.name
          .toLowerCase()
          .includes(state.search.toLowerCase())
    );
  }, [cartItems, state.search]);

  const handleEndTyping = useCallback((value: string) => {
    setState((prev) => ({ ...prev, search: value }));
  }, []);

  const onRowSelectionModelChange = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      const IDs = rowSelectionModel.map((rowId) => rowId.toString());
      setState((prev) => ({ ...prev, selectedProductIDs: IDs }));
    },
    []
  );

  const handleDeleteItems = useCallback(async () => {
    if (state.selectedProductIDs.length && selectedStoreId && connectedUserId) {
      const { confirmed } = await confirm({
        title: "Warning !",
        description: "Do you want to remove the selected item(s)?",
      });
      if (confirmed) {
        cartSrv.removeProducts({
          storeId: selectedStoreId,
          userId: connectedUserId,
          productIDs: state.selectedProductIDs,
        });
        notification.show("Item(s) removed successfully", {
          severity: "success",
          autoHideDuration: 5000,
        });
      }
    }
  }, [
    state.selectedProductIDs,
    cartSrv,
    selectedStoreId,
    connectedUserId,
    confirm,
    notification,
  ]);
  const handleGenerateOrder = useCallback(() => {
    if (!connectedUserId || !selectedStoreId) {
      return;
    }
    const items: Types.CartItem[] = cartItems.filter((cartItem) =>
      state.selectedProductIDs.includes(cartItem.productId)
    );
    const order = new Order({
      storeId: selectedStoreId,
      userId: connectedUserId,
      cartItems: items,
    });

    orderSrv.addOne(order.toObject());
    apiRef.current.setRowSelectionModel([]);
  }, [
    state.selectedProductIDs,
    cartItems,
    orderSrv,
    selectedStoreId,
    connectedUserId,
    apiRef,
  ]);
  const getRowId: GridRowIdGetter<any> | undefined = useCallback(
    (row: Types.CartItem) => {
      return row.productId;
    },
    []
  );

  return (
    <Grid container direction={"column"} spacing={2}>
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="h3" component="h1">
          Cart
        </Typography>
        <Button
          disabled={!state.selectedProductIDs?.length}
          onClick={handleGenerateOrder}
          variant="contained"
        >
          Generate Order
        </Button>
      </Stack>
      <Stack direction="column">
        <Typography variant="subtitle1">
          Manage your cart items and generate order summaries
        </Typography>
      </Stack>
      <Grid container direction={"row"}>
        <Grid {...inputGridSystem}>
          <SearchBar
            onEndTyping={handleEndTyping}
            placeholder="Search by product name"
            fullWidth
            size="small"
            inputProps={{
              "data-testid": "cart-search",
            }}
          />
        </Grid>
        <Grid {...inputGridSystem}>
          <Stack direction="row" justifyContent={"flex-end"}>
            <Button
              disabled={!state.selectedProductIDs?.length}
              onClick={handleDeleteItems}
              variant="contained"
              color="error"
              data-testid="delete-items"
            >
              Delete item(s)
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <ListTable
        rows={filteredProducts}
        columns={columns}
        onRowSelectionModelChange={onRowSelectionModelChange}
        apiRef={apiRef}
        getRowId={getRowId}
        hideActions
        sx={{
          maxWidth: "100vw",
          border: 0,
        }}
        data-testid="cartItems-list"
      />
    </Grid>
  );
}

export default Cart;
