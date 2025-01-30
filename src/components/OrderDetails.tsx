import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import React from "react";
import ListTable from "./ListTable";
import { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";

interface SelectedOrder {
  orderNumber: string;
  orderOwnerName: string;
  createdAt: string;
  orderStoreName: string;
  totalPrice: number;
  items: Types.CartItem[];
}

interface Props {
  subtitle?: string;
  selectedOrder: SelectedOrder;
  columns: GridColDef[];
  getRowId: GridRowIdGetter<Types.CartItem> | undefined;
  handleDeleteOrder?: () => void;
  ordersPagination: true | undefined;
}

const OrderDetails = ({
  subtitle,
  selectedOrder,
  columns,
  getRowId,
  handleDeleteOrder,
  ordersPagination,
}: Props) => {
  return (
    <Stack direction="column">
      <Stack justifyContent="space-between" direction="row">
        <Typography variant="h3" component="h1">
          Order {`#${selectedOrder.orderNumber}`}
        </Typography>
        {handleDeleteOrder ? (
          <Button color="error" onClick={handleDeleteOrder} variant="contained">
            Delete order
          </Button>
        ) : null}
      </Stack>
      <Stack direction="column">
        {subtitle ? (
          <Typography variant="subtitle1">{subtitle}</Typography>
        ) : null}
        <Typography variant="subtitle1">
          Ordered by: {selectedOrder.orderOwnerName}
        </Typography>
        <Typography variant="subtitle1">
          Ordered at: {selectedOrder.createdAt}
        </Typography>
        <Typography variant="subtitle1">
          Store: {selectedOrder.orderStoreName}
        </Typography>
        <Typography variant="subtitle1">
          Total price: {`${selectedOrder.totalPrice}$`}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          ITEMS DETAILS
        </Typography>
      </Stack>
      <ListTable
        rows={selectedOrder.items}
        columns={columns}
        getRowId={getRowId}
        hideActions
        checkboxSelection={false}
        pagination={ordersPagination}
        hideFooterPagination={!ordersPagination}
        sx={{
          maxWidth: "100vw",
          border: 0,
        }}
      />
    </Stack>
  );
};

export default OrderDetails;
