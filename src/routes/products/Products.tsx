import React, { useState, useCallback, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import { useGridApiRef } from "@mui/x-data-grid";
import Grid from "@mui/system/Grid";
import { useConfirm } from "material-ui-confirm";
import { useNotifications } from "@toolpad/core";

import ListTable from "../../components/ListTable";
import { RootState } from "../../services/redux/rootReducer";
import SearchBar from "../../components/SearchBar";
import { ROUTES } from "../../constants/routes";
import { ProductSrv } from "../../services/controllers/ProductSrv";
import { CartSrv } from "../../services/controllers/CartSrv";
import { Cart, CartItem } from "../../classes/Cart";
import { GenericError } from "../../classes/GenericError";
import { inputGridSystem } from "../../constants";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
  },
  {
    field: "description",
    headerName: "Description",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
  },
  {
    field: "key",
    headerName: "Key",
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (key: string) => `#${key}`,
    flex: 1,
    align: "left",
  },
  {
    field: "unitPrice",
    headerName: "Price",
    valueGetter: (price: number) => `${price}$`,
    type: "number",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "minQuantity",
    headerName: "Min. Qty",
    type: "number",
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
    valueGetter: (value: string) => new Date(value),
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
  },
];

interface State {
  search: string;
  selectedProductIDs: string[];
}

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const notifications = useNotifications();

  const apiRef = useGridApiRef();

  const cartSrv = useMemo(() => new CartSrv(dispatch), [dispatch]);
  const productSrv = useMemo(() => new ProductSrv(dispatch), [dispatch]);

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
  const products = useSelector((state: RootState) => {
    const storeId = state.user.selectedStore?._id;
    if (!storeId) {
      return [];
    }
    const data = state.products.filter(
      (product) =>
        product.storeId === storeId &&
        product.owner === state.user.connectedUser?._id &&
        product.active
    );
    return data;
  }, shallowEqual);

  const filteredProducts = useMemo(() => {
    if (!state.search) {
      return products;
    }
    return products.filter((store) =>
      store.name.toLowerCase().includes(state.search.toLowerCase())
    );
  }, [products, state.search]);

  const handleViewClick = (productId: string | number) => {
    navigate(`/${ROUTES.PRODUCTS}/${productId}`);
  };

  const handleEditClick = (productId: string | number) => {
    navigate(`/${ROUTES.PRODUCTS}/${productId}/edit`);
  };

  const handleDeleteClick = useCallback(
    async (productId: string | number) => {
      const product = products.find(
        (_product) => _product._id === productId.toString()
      );
      if (product) {
        const message = `Are you sure you wanna delete this product (${product.name})?`;
        // eslint-disable-next-line no-restricted-globals
        const { confirmed } = await confirm({
          title: "Warning !",
          description: message,
        });
        if (confirmed) {
          const productSrv = new ProductSrv(dispatch);
          productSrv.deleteOne(product._id);
          notifications.show(`${product.name} has been deleted`, {
            severity: "success",
            autoHideDuration: 5000,
          });
        }
      }
    },
    [dispatch, products, confirm, notifications]
  );

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

  const onAddToCart = useCallback(() => {
    if (connectedUserId && selectedStoreId) {
      const items: Types.CartItem[] = state.selectedProductIDs.map(
        (productId) => {
          const item = new CartItem(productId, 1);
          return item.calculateTotalPrice(productSrv).toObject();
        }
      );
      const cart = new Cart({
        storeId: selectedStoreId,
        userId: connectedUserId,
      });
      const cartObj: Types.Cart = cart.addItems(items).toObject();
      apiRef.current.setRowSelectionModel([]);
      cartSrv.addItems({
        userId: connectedUserId,
        storeId: selectedStoreId,
        data: cartObj,
      });
      notifications.show("Cart updated", {
        severity: "success",
        autoHideDuration: 5000,
      });
    } else {
      const error = new GenericError("Something went wrong");
      notifications.show(error.publicMessage, {
        severity: "success",
        autoHideDuration: 5000,
      });
    }
  }, [
    state.selectedProductIDs,
    cartSrv,
    productSrv,
    connectedUserId,
    selectedStoreId,
    apiRef,
    notifications,
  ]);
  const handleGenerateGraphics = useCallback(() => {
    if (
      !connectedUserId ||
      !selectedStoreId ||
      !state.selectedProductIDs.length
    ) {
      const error = new GenericError("Something went wrong");
      alert(error.publicMessage);
      return;
    }
    if (state.selectedProductIDs.length > 3) {
      notifications.show(
        "You can only create a graphic of maximum 3 products",
        {
          severity: "warning",
          autoHideDuration: 5000,
        }
      );
      return;
    }
    const tempTargetedProducts = filteredProducts.filter((prod) =>
      state.selectedProductIDs.includes(prod._id)
    );
    try {
      const payload: string = JSON.stringify(tempTargetedProducts);
      localStorage.setItem("tempTargetedProducts", payload);
      navigate(`/${ROUTES.GRAPHICS}/add`);
    } catch (err: any) {
      const error = new GenericError(
        err.message || err.reason || "Something went wrong"
      );
      alert(error.publicMessage);
    } finally {
      apiRef.current.setRowSelectionModel([]);
    }
  }, [
    filteredProducts,
    state.selectedProductIDs,
    connectedUserId,
    selectedStoreId,
    navigate,
    apiRef,
    notifications,
  ]);

  return (
    <Grid container direction={"column"} spacing={2}>
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="h3" component="h1">
          Products
        </Typography>
        <Button
          onClick={() => navigate(`/${ROUTES.PRODUCTS}/add`)}
          variant="contained"
        >
          Add Product
        </Button>
      </Stack>
      <Stack direction="column">
        <Typography variant="subtitle1">
          Add, search, manage and select your products
        </Typography>
      </Stack>
      <Grid container direction={"row"}>
        <Grid {...inputGridSystem}>
          <SearchBar
            fullWidth
            size="small"
            onEndTyping={handleEndTyping}
            placeholder="Search by name"
            inputProps={{
              "data-testid": "product-search",
            }}
          />
        </Grid>
        <Grid {...inputGridSystem}>
          <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
            <Button
              disabled={!state.selectedProductIDs.length}
              onClick={onAddToCart}
              variant="contained"
              color="secondary"
              sx={{ color: "white" }}
              data-testid="add-to-cart-btn"
            >
              Add to cart
            </Button>
            <Button
              disabled={!state.selectedProductIDs.length}
              variant="contained"
              onClick={handleGenerateGraphics}
              color="success"
              data-testid="generate-graphic-btn"
            >
              Generate graphic
            </Button>
            <Button
              disabled={!state.selectedProductIDs.length}
              variant="contained"
              color="error"
            >
              Delete product(s)
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <ListTable
        rows={filteredProducts}
        columns={columns}
        onDeleteClick={handleDeleteClick}
        onViewClick={handleViewClick}
        onEditClick={handleEditClick}
        onRowSelectionModelChange={onRowSelectionModelChange}
        apiRef={apiRef}
        sx={{
          maxWidth: "100vw",
          border: 0,
        }}
        data-testid="products-list"
      />
    </Grid>
  );
}

export default Products;
