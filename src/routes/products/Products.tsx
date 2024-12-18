import React, { useState, useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import ListTable from "../../components/ListTable";
import { RootState } from "../../services/redux/rootReducer";
import SearchBar from "../../components/SearchBar";
import { ROUTES } from "../../constants/routes";
import { ProductSrv } from "../../services/controllers/ProductSrv";

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

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({ search: "" });
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
            <Button variant="contained">Add to cart</Button>
            <Button variant="contained">Generate graphic(s)</Button>
            <Button variant="contained">Delete product(s)</Button>
          </Stack>
        </Stack>
        <ListTable
          rows={filteredProducts}
          columns={columns}
          onDeleteClick={handleDeleteClick}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
        />
      </Stack>
    </Container>
  );
}

export default Products;
