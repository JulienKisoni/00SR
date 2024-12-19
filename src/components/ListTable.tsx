import React, { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type {
  GridColDef,
  GridRenderCellParams,
  DataGridProps,
} from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuList from "@mui/material/MenuList";

interface ActionProps {
  params: GridRenderCellParams;
  onEditClick: () => void;
  onViewClick: () => void;
  onDeleteClick: () => void;
}
const Actions = ({
  params,
  onDeleteClick,
  onEditClick,
  onViewClick,
}: ActionProps) => {
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [selectedRowId, setSelectedRowId] = useState<null | string | number>(
    null
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    rowId: string | number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };
  return (
    <>
      <IconButton onClick={(event) => handleMenuOpen(event, params.id)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && selectedRowId === params.id}
        onClose={handleMenuClose}
      >
        <MenuList>
          <MenuItem onClick={onViewClick}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" style={{ marginRight: 8 }} />
            </ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
          <MenuItem onClick={onEditClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" style={{ marginRight: 8 }} />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={onDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

interface Props extends DataGridProps {
  onEditClick: (id: string | number) => void;
  onViewClick: (id: string | number) => void;
  onDeleteClick: (id: string | number) => void;
}

const ListTable = (props: Props) => {
  const {
    rows,
    columns,
    onDeleteClick,
    onEditClick,
    onViewClick,
    ...restProps
  } = props;

  const displayedColumns: GridColDef<any>[] = useMemo(() => {
    return [
      ...columns,
      {
        field: "",
        headerName: "Actions",
        type: "actions",
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <Actions
              onDeleteClick={() => onDeleteClick(params.id)}
              onEditClick={() => onEditClick(params.id)}
              onViewClick={() => onViewClick(params.id)}
              params={params}
            />
          );
        },
      },
    ];
  }, [columns, onDeleteClick, onViewClick, onEditClick]);

  return (
    <DataGrid
      rows={rows}
      columns={displayedColumns}
      pagination={undefined}
      checkboxSelection
      getRowId={(row: any) => row._id}
      sx={{ border: 0 }}
      disableRowSelectionOnClick
      {...restProps}
    />
  );
};

export default ListTable;
