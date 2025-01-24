import React, { useState, useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import { useGridApiRef } from "@mui/x-data-grid";

import ListTable from "../../components/ListTable";
import { RootState } from "../../services/redux/rootReducer";
import SearchBar from "../../components/SearchBar";
import { ROUTES } from "../../constants/routes";
import { ProductSrv } from "../../services/controllers/ProductSrv";
import { CartSrv } from "../../services/controllers/CartSrv";
import { Cart, CartItem } from "../../classes/Cart";
import { GenericError } from "../../classes/GenericError";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "description",
    headerName: "Description",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "key",
    headerName: "Key",
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (key: string) => `#${key}`,
  },
  {
    field: "unitPrice",
    headerName: "Price",
    valueGetter: (price: number) => `${price}$`,
    type: "number",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "minQuantity",
    headerName: "Min. Qty",
    type: "number",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    type: "date",
    valueGetter: (value: string) => new Date(value),
    sortable: false,
    disableColumnMenu: true,
  },
];

interface State {
  search: string;
  selectedProductIDs: string[];
}

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    (productId: string | number) => {
      const product = products.find(
        (_product) => _product._id === productId.toString()
      );
      if (product) {
        const message = `Are you sure you wanna delete this product (${product.name})?`;
        // eslint-disable-next-line no-restricted-globals
        const agree = confirm(message);
        if (agree) {
          const productSrv = new ProductSrv(dispatch);
          productSrv.deleteOne(product._id);
        }
      }
    },
    [dispatch, products]
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
    } else {
      const error = new GenericError("Something went wrong");
      alert(error.publicMessage);
    }
  }, [
    state.selectedProductIDs,
    cartSrv,
    productSrv,
    connectedUserId,
    selectedStoreId,
    apiRef,
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
    // TODO: max of 3 products per graphic
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
  ]);

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
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
          <Typography variant="subtitle2">
            Add, search, manage and select your products
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <SearchBar
            onEndTyping={handleEndTyping}
            placeholder="Search by name"
          />
          <Stack direction="row">
            <Button
              disabled={!state.selectedProductIDs.length}
              onClick={onAddToCart}
              variant="contained"
            >
              Add to cart
            </Button>
            <Button
              disabled={!state.selectedProductIDs.length}
              variant="contained"
              onClick={handleGenerateGraphics}
            >
              Generate graphic(s)
            </Button>
            <Button variant="contained">Delete product(s)</Button>
          </Stack>
        </Stack>
        <ListTable
          rows={filteredProducts}
          columns={columns}
          onDeleteClick={handleDeleteClick}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
          onRowSelectionModelChange={onRowSelectionModelChange}
          apiRef={apiRef}
        />
      </Stack>
    </Container>
  );
}

export default Products;
