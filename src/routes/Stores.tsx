import React from "react";
import Container from "@mui/material/Container";
import { useSelector, shallowEqual } from "react-redux";
import type { GridColDef } from "@mui/x-data-grid";

import StoreFormCtlr from "../components/controllers/forms/StoreFormCtrl";
import ListTable from "../components/ListTable";
import { RootState } from "../services/redux/rootReducer";

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
  const stores = useSelector((state: RootState) => {
    const data = state.stores.filter(
      (store) => store.owner === state.user.connectedUser?._id
    );
    return data;
  }, shallowEqual);

  const handleViewClick = () => {
    console.log("View clicked for row id:");
  };

  const handleEditClick = () => {
    console.log("Edit clicked for row id:");
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked for row id:");
  };

  return (
    <Container>
      Stores Route
      <ListTable
        rows={stores}
        columns={columns}
        onDeleteClick={handleDeleteClick}
        onViewClick={handleViewClick}
        onEditClick={handleEditClick}
      />
      <StoreFormCtlr />
    </Container>
  );
}

export default Stores;
