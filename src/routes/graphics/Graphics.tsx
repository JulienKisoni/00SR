import React, { useState, useCallback, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import type {
  GridColDef,
  GridRowIdGetter,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import Grid from "@mui/system/Grid";
import { useNotifications } from "@toolpad/core";
import { useConfirm } from "material-ui-confirm";

import SearchBar from "../../components/SearchBar";
import ListTable from "../../components/ListTable";
import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import { GraphicSrv } from "../../services/controllers/GraphicSrv";
import { inputGridSystem } from "../../constants";

interface State {
  search: string;
  selectedGraphicIDs: string[];
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "description",
    headerName: "Description",
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
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (value: string) => new Date(value),
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "products",
    headerName: "# Products",
    type: "number",
    valueGetter: (products: Types.IProductDocument[]) => products.length,
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
];

function Graphics() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const notifications = useNotifications();

  const apiRef = useGridApiRef();

  const graphicSrv = useMemo(() => new GraphicSrv(dispatch), [dispatch]);

  const [state, setState] = useState<State>({
    search: "",
    selectedGraphicIDs: [],
  });
  const connectedUserId = useSelector((state: RootState) => {
    return state.user.connectedUser?._id;
  }, shallowEqual);
  const selectedStoreId = useSelector((state: RootState) => {
    return state.user.selectedStore?._id;
  }, shallowEqual);
  const graphics: Types.IGraphicDocument[] = useSelector((state: RootState) => {
    if (!selectedStoreId || !connectedUserId) {
      return [];
    }
    return state.graphics.filter(
      (graphic) => graphic.storeId === selectedStoreId
    );
  }, shallowEqual);
  const filteredGraphics: Types.IGraphicDocument[] = useMemo(() => {
    if (!state.search) {
      return graphics;
    }
    return graphics.filter((item) =>
      item.name.toLowerCase().includes(state.search.toLowerCase())
    );
  }, [graphics, state.search]);

  const handleEndTyping = useCallback((value: string) => {
    setState((prev) => ({ ...prev, search: value }));
  }, []);

  const onRowSelectionModelChange = useCallback(
    (rowSelectionModel: GridRowSelectionModel) => {
      const IDs = rowSelectionModel.map((rowId) => rowId.toString());
      setState((prev) => ({ ...prev, selectedGraphicIDs: IDs }));
    },
    []
  );

  const handleDeleteItems = useCallback(() => {
    if (state.selectedGraphicIDs.length && selectedStoreId && connectedUserId) {
      graphicSrv.deleteMany(state.selectedGraphicIDs);
    }
  }, [state.selectedGraphicIDs, selectedStoreId, connectedUserId, graphicSrv]);
  const getRowId: GridRowIdGetter<Types.IGraphicDocument> | undefined =
    useCallback((row: Types.IGraphicDocument) => {
      return row._id;
    }, []);
  const handleSingleDelete = useCallback(
    async (graphicId: string | number) => {
      const graphic = filteredGraphics.find(
        (_graphic) => _graphic._id === graphicId.toString()
      );
      if (graphic) {
        const message = `Are you sure you wanna delete this graphic (${graphic.name})?`;
        const { confirmed } = await confirm({
          title: "Warning !",
          description: message,
        });
        if (confirmed) {
          const { error } = graphicSrv.deleteOne(graphicId.toString());
          if (error) {
            notifications.show(error.publicMessage, {
              severity: "error",
              autoHideDuration: 5000,
            });
          } else {
            notifications.show(`${graphic.name} has been deleted`, {
              severity: "success",
              autoHideDuration: 5000,
            });
          }
        }
      }
    },
    [graphicSrv, filteredGraphics, confirm, notifications]
  );
  const handleViewGraphic = useCallback(
    (graphicId: string | number) => {
      navigate(`/${ROUTES.GRAPHICS}/${graphicId}`);
    },
    [navigate]
  );
  const handleEditGraphic = useCallback(
    (graphicId: string | number) => {
      navigate(`/${ROUTES.GRAPHICS}/${graphicId}/edit`);
    },
    [navigate]
  );

  return (
    <Grid container direction={"column"} spacing={2}>
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="h3" component="h1">
          Graphics
        </Typography>
      </Stack>
      <Stack direction="column">
        <Typography variant="subtitle1">
          View and manage your graphics
        </Typography>
      </Stack>
      <Grid container direction={"row"}>
        <Grid {...inputGridSystem}>
          <SearchBar
            onEndTyping={handleEndTyping}
            placeholder="Search by name"
            fullWidth
            size="small"
            inputProps={{
              "data-testid": "graphics-search",
            }}
          />
        </Grid>
        <Grid {...inputGridSystem}>
          <Stack direction="row" justifyContent={"flex-end"}>
            <Button
              disabled={!state.selectedGraphicIDs?.length}
              onClick={handleDeleteItems}
              variant="contained"
              color="error"
            >
              Delete graphic(s)
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <ListTable
        rows={filteredGraphics}
        columns={columns}
        onDeleteClick={handleSingleDelete}
        onViewClick={handleViewGraphic}
        onEditClick={handleEditGraphic}
        onRowSelectionModelChange={onRowSelectionModelChange}
        apiRef={apiRef}
        getRowId={getRowId}
        sx={{
          maxWidth: "100vw",
          border: 0,
        }}
        data-testid="graphics-list"
      />
    </Grid>
  );
}

export default Graphics;
