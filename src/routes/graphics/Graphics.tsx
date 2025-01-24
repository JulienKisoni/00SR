import React, { useState, useCallback, useMemo } from "react";
import Container from "@mui/material/Container";
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

import SearchBar from "../../components/SearchBar";
import ListTable from "../../components/ListTable";
import { RootState } from "../../services/redux/rootReducer";
import { ROUTES } from "../../constants/routes";
import { GraphicSrv } from "../../services/controllers/Graphic";

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
  },
  {
    field: "description",
    headerName: "Description",
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    type: "date",
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (value: string) => new Date(value),
  },
  {
    field: "products",
    headerName: "# Products",
    type: "number",
    valueGetter: (products: Types.IProductDocument[]) => products.length,
    sortable: false,
    disableColumnMenu: true,
  },
];

function Graphics() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    (graphicId: string | number) => {
      const graphic = filteredGraphics.find(
        (_graphic) => _graphic._id === graphicId.toString()
      );
      if (graphic) {
        const message = `Are you sure you wanna delete this graphic (${graphic.name})?`;
        // eslint-disable-next-line no-restricted-globals
        const agree = confirm(message);
        if (agree) {
          const { error } = graphicSrv.deleteOne(graphicId.toString());
          if (error) {
            alert(error.publicMessage);
          }
        }
      }
    },
    [graphicSrv, filteredGraphics]
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
    <Container>
      <Stack spacing={2.5} direction="column">
        <Stack justifyContent="space-between" direction="row">
          <Typography variant="h3" component="h1">
            Graphics
          </Typography>
        </Stack>
        <Stack direction="column">
          <Typography variant="subtitle2">
            View and manage your graphics
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <SearchBar
            onEndTyping={handleEndTyping}
            placeholder="Search by name"
          />
          <Stack direction="row">
            <Button
              disabled={!state.selectedGraphicIDs?.length}
              onClick={handleDeleteItems}
              variant="contained"
            >
              Delete graphic(s)
            </Button>
          </Stack>
        </Stack>
        <ListTable
          rows={filteredGraphics}
          columns={columns}
          onDeleteClick={handleSingleDelete}
          onViewClick={handleViewGraphic}
          onEditClick={handleEditGraphic}
          onRowSelectionModelChange={onRowSelectionModelChange}
          apiRef={apiRef}
          getRowId={getRowId}
        />
      </Stack>
    </Container>
  );
}

export default Graphics;
