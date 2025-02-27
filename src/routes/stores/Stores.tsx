import React, { useState, useCallback, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type { GridColDef } from "@mui/x-data-grid";
import Grid from "@mui/system/Grid";
import { useNavigate } from "react-router";
import { useConfirm } from "material-ui-confirm";
import { useNotifications } from "@toolpad/core";

import ListTable from "../../components/ListTable";
import { RootState } from "../../services/redux/rootReducer";
import SearchBar from "../../components/SearchBar";
import { ROUTES } from "../../constants/routes";
import { StoreSrv } from "../../services/controllers/StoreSrv";
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
    field: "products",
    headerName: "# Products",
    valueGetter: (value: any[]) => value.length,
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

function Stores() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const notifications = useNotifications();

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

  const handleViewClick = (storeId: string | number) => {
    navigate(`/${ROUTES.STORES}/${storeId}`);
  };

  const handleEditClick = (storeId: string | number) => {
    navigate(`/${ROUTES.STORES}/${storeId}/edit`);
  };

  const handleDeleteClick = useCallback(
    async (storeId: string | number) => {
      const store = stores.find((_store) => _store._id === storeId.toString());
      if (store) {
        const message = `Are you sure you wanna delete this store (${store.name})?`;
        const { confirmed } = await confirm({
          title: "Warning !",
          description: message,
        });
        if (confirmed) {
          const storesSrv = new StoreSrv(dispatch);
          storesSrv.deleteOne(store._id);
          notifications.show(`${store.name} has been deleted`, {
            severity: "success",
            autoHideDuration: 5000,
          });
        }
      }
    },
    [dispatch, stores, confirm, notifications]
  );

  const handleEndTyping = useCallback((value: string) => {
    setState((prev) => ({ ...prev, search: value }));
  }, []);

  return (
    <Grid container direction={"column"} spacing={2}>
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="h3" component="h1">
          Stores
        </Typography>
        <Button
          onClick={() => navigate(`/${ROUTES.STORES}/add`)}
          variant="contained"
        >
          Add store
        </Button>
      </Stack>
      <Stack direction="column">
        <Typography variant="subtitle1">
          Add, search, manage and select your stores
        </Typography>
        <Typography variant="subtitle1">
          Select your store by clicking on it
        </Typography>
      </Stack>
      <Grid {...inputGridSystem}>
        <SearchBar
          size="small"
          fullWidth
          onEndTyping={handleEndTyping}
          placeholder="Search by name"
          inputProps={{
            "data-testid": "store-search",
          }}
        />
      </Grid>
      <ListTable
        rows={filteredStores}
        columns={columns}
        onDeleteClick={handleDeleteClick}
        onViewClick={handleViewClick}
        onEditClick={handleEditClick}
        checkboxSelection={false}
        sx={{
          maxWidth: "100vw",
          border: 0,
        }}
        data-testid="stores-list"
      />
    </Grid>
  );
}

export default Stores;
