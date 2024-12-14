import React, { useState, useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual } from "react-redux";
import type { GridColDef } from "@mui/x-data-grid";

import ListTable from "../../components/ListTable";
import { RootState } from "../../services/redux/rootReducer";
import SearchBar from "../../components/SearchBar";

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
    field: "products",
    headerName: "# Products",
    valueGetter: (value: any[]) => value.length,
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

function Stores() {
  const [state, setState] = useState({ search: "" });
  const stores = useSelector((state: RootState) => {
    const data = state.stores.filter(
      (store) => store.owner === state.user.connectedUser?._id && store.active
    );
    return data;
  }, shallowEqual);

  const filteredStores = useMemo(() => {
    if (!state.search) {
      return stores;
    }
    return stores.filter((store) =>
      store.name.toLowerCase().includes(state.search.toLowerCase())
    );
  }, [stores, state.search]);

  const handleViewClick = () => {
    console.log("View clicked for row id:");
  };

  const handleEditClick = () => {
    console.log("Edit clicked for row id:");
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked for row id:");
  };

  const handleEndTyping = useCallback((value: string) => {
    setState((prev) => ({ ...prev, search: value }));
  }, []);

  return (
    <Container>
      <Stack spacing={2.5} direction="column">
        <Stack justifyContent="space-between" direction="row">
          <Typography variant="h3" component="h1">
            Stores
          </Typography>
          <Button variant="contained">Add store</Button>
        </Stack>
        <Stack direction="column">
          <Typography variant="subtitle2">
            Add, search, manage and select your stores
          </Typography>
          <Typography variant="subtitle2">
            Select your store by clicking on it
          </Typography>
        </Stack>
        <SearchBar onEndTyping={handleEndTyping} placeholder="Search by name" />
        <ListTable
          rows={filteredStores}
          columns={columns}
          onDeleteClick={handleDeleteClick}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
        />
      </Stack>
    </Container>
  );
}

export default Stores;
