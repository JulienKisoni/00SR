import React, { useState, useCallback, useMemo, memo } from "react";
import Container from "@mui/material/Container";
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
import { useNavigate } from "react-router";
import { useGridApiRef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import debounce from "lodash.debounce";

import { ROUTES } from "../constants/routes";
import SearchBar from "../components/SearchBar";
import ListTable from "../components/ListTable";
import { RootState } from "../services/redux/rootReducer";
import { CartSrv } from "../services/controllers/CartSrv";

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
        alert(error.publicMessage);
      }
    },
    [cartSrv, storeId, userId, row]
  );
  const debouncedEndTyping = useMemo(
    () => debounce(onEndTyping, 1000),
    [onEndTyping]
  );
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      if (parseInt(value, 10) <= 0) {
        return;
      }
      setState((prev) => ({ ...prev, value }));
      // Call API
      debouncedEndTyping(value);
    },
    [debouncedEndTyping]
  );

  return (
    <TextField
      id="buyQty"
      variant="outlined"
      name="name"
      value={state.value}
      type="number"
      onChange={handleChange}
    />
  );
});

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const apiRef = useGridApiRef();

  const cartSrv = useMemo(() => new CartSrv(dispatch), [dispatch]);

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

  const handleDeleteItems = useCallback(() => {
    if (state.selectedProductIDs.length && selectedStoreId && connectedUserId) {
      cartSrv.removeProducts({
        storeId: selectedStoreId,
        userId: connectedUserId,
        productIDs: state.selectedProductIDs,
      });
    }
  }, [state.selectedProductIDs, cartSrv, selectedStoreId, connectedUserId]);
  const handleGenerateOrder = useCallback(() => {
    navigate(`/${ROUTES.ORDERS}`);
  }, [navigate]);
  const getRowId: GridRowIdGetter<any> | undefined = useCallback(
    (row: Types.CartItem) => {
      return row.productId;
    },
    []
  );

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Stack justifyContent="space-between" direction="row">
          <Typography variant="h3" component="h1">
            Cart
          </Typography>
          <Button onClick={handleGenerateOrder} variant="contained">
            Generate Order
          </Button>
        </Stack>
        <Stack direction="column">
          <Typography variant="subtitle2">
            Manage your cart items and generate order summaries
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <SearchBar
            onEndTyping={handleEndTyping}
            placeholder="Search by product name"
          />
          <Stack direction="row">
            <Button
              disabled={!state.selectedProductIDs?.length}
              onClick={handleDeleteItems}
              variant="contained"
            >
              Delete item(s)
            </Button>
          </Stack>
        </Stack>
        <ListTable
          rows={filteredProducts}
          columns={columns}
          onDeleteClick={() => {}}
          onViewClick={() => {}}
          onEditClick={() => {}}
          onRowSelectionModelChange={onRowSelectionModelChange}
          apiRef={apiRef}
          getRowId={getRowId}
          hideActions
        />
      </Stack>
    </Container>
  );
}

export default Cart;
