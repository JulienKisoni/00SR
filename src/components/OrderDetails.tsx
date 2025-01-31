import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import React, { useMemo } from "react";
import ListTable from "./ListTable";
import { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";
import { SxProps, Theme } from "@mui/material";

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
  listSx?: SxProps<Theme>;
  variant?: "small";
}

const OrderDetails = ({
  subtitle,
  selectedOrder,
  columns,
  getRowId,
  handleDeleteOrder,
  ordersPagination,
  listSx,
  variant,
}: Props) => {
  const titleSx = useMemo(() => {
    if (!variant) {
      return undefined;
    }
    return {
      fontSize: 17,
      fontWeight: "bold",
    };
  }, [variant]);
  const title2Sx = useMemo(() => {
    if (!variant) {
      return {
        fontWeight: "bold",
      };
    }
    return {
      fontSize: 14,
      fontWeight: "bold",
    };
  }, [variant]);
  const subtitleSx = useMemo(() => {
    if (!variant) {
      return undefined;
    }
    return {
      fontSize: 15,
      lineHeight: 1.2,
    };
  }, [variant]);
  return (
    <Stack direction="column">
      <Stack justifyContent="space-between" direction="row">
        <Typography sx={titleSx} variant="h3" component="h1">
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
          <Typography mt={2} variant="subtitle1">
            {subtitle}
          </Typography>
        ) : null}
        <Typography sx={subtitleSx} variant="subtitle1">
          Ordered by: {selectedOrder.orderOwnerName}
        </Typography>
        <Typography sx={subtitleSx} variant="subtitle1">
          Ordered at: {selectedOrder.createdAt}
        </Typography>
        <Typography sx={subtitleSx} variant="subtitle1">
          Store: {selectedOrder.orderStoreName}
        </Typography>
        <Typography sx={subtitleSx} variant="subtitle1">
          Total price: {`${selectedOrder.totalPrice}$`}
        </Typography>
        <Typography mt={2} variant="subtitle1" sx={title2Sx}>
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
          ...listSx,
        }}
      />
    </Stack>
  );
};

export default OrderDetails;
